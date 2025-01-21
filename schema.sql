
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA IF NOT EXISTS "public";

ALTER SCHEMA "public" OWNER TO "pg_database_owner";

CREATE OR REPLACE FUNCTION "public"."get_random_ad"("excluded_posts" "uuid"[], "privileged_users" "uuid"[]) RETURNS TABLE("id" "uuid")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        w.id
    FROM (
        SELECT
            p.id,
            CASE 
                WHEN (p.ending_date - p.starting_date) > interval '0' THEN 
                    p.user_spent_amount / EXTRACT(EPOCH FROM (p.ending_date - p.starting_date))
                ELSE 
                    p.user_spent_amount
            END AS amount_per_day,
            (COALESCE(COUNT(r.post_id), 0) + COALESCE(COUNT(s.post_id), 0)) AS reactions_saved_count,
            CASE WHEN p.user_id = ANY(privileged_users) THEN 2 ELSE 1 END AS user_priority
        FROM
            posts p
        LEFT JOIN
            reactions r ON p.id = r.post_id
        LEFT JOIN
            posts_saved s ON p.id = s.post_id
        WHERE
            p.id NOT IN (SELECT unnest(excluded_posts))
            AND p.user_spent_amount IS NOT NULL
            AND p.starting_date IS NOT NULL
            AND p.ending_date IS NOT NULL
            AND p.deleted_at IS NULL
            AND p.private IS FALSE
            AND p.promoted IS TRUE
            AND current_timestamp BETWEEN p.starting_date AND p.ending_date
        GROUP BY
            p.id
    ) AS w
    ORDER BY
        random() * (w.amount_per_day * 0.5 + w.reactions_saved_count * 0.3 + w.user_priority * 0.2) DESC
    LIMIT 1;

END;
$$;

ALTER FUNCTION "public"."get_random_ad"("excluded_posts" "uuid"[], "privileged_users" "uuid"[]) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "user_id" "uuid" NOT NULL,
    "username" "text" NOT NULL,
    "certified" boolean DEFAULT false NOT NULL,
    "pdp" "text",
    "description" "text",
    "wallpaper" "text",
    "my_tags" "json",
    "associate_tags" "json",
    "my_rss" "json",
    "deleted_at" timestamp with time zone,
    CONSTRAINT "profiles_username_check" CHECK (("length"("username") >= 3))
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_random_profiles2"("authenticated_user_id" "uuid") RETURNS SETOF "public"."profiles"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
    SELECT *
    FROM profiles
    WHERE user_id NOT IN (
      SELECT user_follow_id
      FROM following
      WHERE user_id = authenticated_user_id
    )
    AND user_id != authenticated_user_id
    AND profiles.deleted_at IS NULL
    ORDER BY random()
    LIMIT 3;
END;
$$;

ALTER FUNCTION "public"."get_random_profiles2"("authenticated_user_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_reactions_by_user"("authenticated_user_id" "uuid") RETURNS TABLE("id" bigint, "type" character varying, "user_id" "uuid", "is_read" boolean, "username" "text", "pdp" "text", "post_id" "uuid", "private" boolean, "is_see" boolean, "comment_id" "uuid")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
    SELECT r.id, r.type, r.user_id, r.is_read, u.username, u.pdp, p.id, p.private, r.is_see, r.comment_id
    FROM reactions r
    JOIN posts p ON r.post_id = p.id
    JOIN profiles u ON u.user_id = r.user_id
    WHERE p.user_id = authenticated_user_id
    AND r.user_id != authenticated_user_id
    AND r.archiving_date IS NULL
    AND r.deleted_at IS NULL
    AND p.deleted_at IS NULL;
END;
$$;

ALTER FUNCTION "public"."get_reactions_by_user"("authenticated_user_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."reactions_not_seen"("authenticated_user_id" "uuid") RETURNS SETOF bigint
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
    SELECT COUNT(*)
    FROM reactions r
    JOIN posts p ON r.post_id = p.id
    JOIN profiles u ON u.user_id = r.user_id
    WHERE p.user_id = authenticated_user_id
    AND r.user_id != authenticated_user_id
    AND r.archiving_date IS NULL
    AND r.deleted_at IS NULL
    AND p.deleted_at IS NULL
    AND r.is_see IS false;
END;
$$;

ALTER FUNCTION "public"."reactions_not_seen"("authenticated_user_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."search_posts"("keyword" "text") RETURNS TABLE("id" "uuid")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
    SELECT
      p.id
    FROM
      posts p
      JOIN profiles ON profiles.user_id = p.user_id
      JOIN posts_tags pt ON pt.post_id = p.id
      JOIN tags t ON t.id = pt.tag_id
    WHERE
      profiles.username ILIKE '%' || keyword || '%'
      OR p.link ILIKE '%' || keyword || '%'
      OR p.description ILIKE '%' || keyword || '%'
      OR t.name ILIKE '%' || keyword || '%'
      AND p.deleted_at IS NULL
      AND p.private IS FALSE
    GROUP by
      p.id;
END;
$$;

ALTER FUNCTION "public"."search_posts"("keyword" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."search_users"("keyword" "text") RETURNS TABLE("user_id" "uuid", "username" "text", "pdp" "text", "count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
    SELECT
      p.user_id,
      p.username,
      p.pdp,
      count(*) as count
    FROM
      profiles p
    LEFT JOIN following f ON p.user_id = f.user_follow_id
    WHERE
      p.username ILIKE '%' || keyword || '%'
      AND p.deleted_at IS NULL
    GROUP by
      p.user_id
    ORDER by
      count desc
    LIMIT 10;
END;
$$;

ALTER FUNCTION "public"."search_users"("keyword" "text") OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."following" (
    "user_id" "uuid" NOT NULL,
    "user_follow_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."following" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."posts" (
    "user_id" "uuid" NOT NULL,
    "link" character varying,
    "promoted" boolean DEFAULT false NOT NULL,
    "showcase" character varying,
    "private" boolean DEFAULT false NOT NULL,
    "description" "text" NOT NULL,
    "published_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "starting_date" timestamp with time zone,
    "ending_date" timestamp with time zone,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "parent_id" "uuid",
    "user_spent_amount" bigint
);

ALTER TABLE "public"."posts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."posts_saved" (
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "post_id" "uuid" NOT NULL
);

ALTER TABLE "public"."posts_saved" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."posts_tags" (
    "tag_id" bigint NOT NULL,
    "post_id" "uuid" NOT NULL
);

ALTER TABLE "public"."posts_tags" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."reactions" (
    "user_id" "uuid" NOT NULL,
    "type" character varying NOT NULL,
    "is_read" boolean DEFAULT false NOT NULL,
    "comment_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone,
    "post_id" "uuid" NOT NULL,
    "archiving_date" timestamp with time zone,
    "is_see" boolean DEFAULT false NOT NULL,
    "id" bigint NOT NULL
);

ALTER TABLE "public"."reactions" OWNER TO "postgres";

ALTER TABLE "public"."reactions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."reactions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."readLater" (
    "user_id" "uuid" NOT NULL,
    "added_date" timestamp with time zone DEFAULT "now"() NOT NULL,
    "selected_date" timestamp with time zone NOT NULL,
    "rss_link" "text" NOT NULL,
    "my_author" "text"
);

ALTER TABLE "public"."readLater" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."reports" (
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "post_id" "uuid" NOT NULL,
    "category" "text" NOT NULL,
    "comment" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."reports" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."rss" (
    "link" "text" NOT NULL,
    "title" "text" NOT NULL,
    "pubDate" timestamp with time zone DEFAULT "now"() NOT NULL,
    "enclosure_link" "text",
    "author" "text",
    "id" bigint NOT NULL,
    "user_id" "uuid"
);

ALTER TABLE "public"."rss" OWNER TO "postgres";

ALTER TABLE "public"."rss" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."rss_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."stripe_customers" (
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "customer_id" "text" NOT NULL
);

ALTER TABLE "public"."stripe_customers" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tags" (
    "id" bigint NOT NULL,
    "name" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."tags" OWNER TO "postgres";

ALTER TABLE "public"."tags" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."tags_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE OR REPLACE VIEW "public"."top_10_posts" AS
 SELECT "r"."post_id",
    "count"(*) AS "reaction_count"
   FROM ("public"."posts" "p"
     JOIN "public"."reactions" "r" ON (("r"."post_id" = "p"."id")))
  WHERE (("p"."published_at" > ("now"() - '48:00:00'::interval)) AND ("p"."private" IS FALSE) AND ("p"."deleted_at" IS NULL) AND ("r"."deleted_at" IS NULL))
  GROUP BY "r"."post_id"
  ORDER BY ("count"(*)) DESC
 LIMIT 10;

ALTER TABLE "public"."top_10_posts" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."top_10_tags" AS
 SELECT "posts_tags"."tag_id",
    "tags"."name",
    "tags"."created_at",
    "count"(*) AS "count"
   FROM ("public"."posts_tags"
     JOIN "public"."tags" ON (("posts_tags"."tag_id" = "tags"."id")))
  GROUP BY "posts_tags"."tag_id", "tags"."name", "tags"."created_at"
  ORDER BY ("count"(*)) DESC, "tags"."created_at" DESC
 LIMIT 10;

ALTER TABLE "public"."top_10_tags" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."trends_tags" AS
 SELECT "posts_tags"."tag_id",
    "tags"."name",
    "tags"."created_at",
    "count"(*) AS "count"
   FROM ("public"."posts_tags"
     JOIN "public"."tags" ON (("posts_tags"."tag_id" = "tags"."id")))
  GROUP BY "posts_tags"."tag_id", "tags"."name", "tags"."created_at"
  ORDER BY ("count"(*)) DESC, "tags"."created_at" DESC
 LIMIT 20;

ALTER TABLE "public"."trends_tags" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_plan" (
    "user_id" "uuid" NOT NULL,
    "starting_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "ending_at" timestamp with time zone,
    "billing_type" character varying NOT NULL,
    "plan_id" numeric DEFAULT '1'::numeric NOT NULL
);

ALTER TABLE "public"."user_plan" OWNER TO "postgres";

ALTER TABLE ONLY "public"."following"
    ADD CONSTRAINT "following_pkey" PRIMARY KEY ("user_id", "user_follow_id");

ALTER TABLE ONLY "public"."posts_saved"
    ADD CONSTRAINT "postsSaved_pkey" PRIMARY KEY ("post_id", "user_id");

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."posts_tags"
    ADD CONSTRAINT "posts_tags_pkey" PRIMARY KEY ("post_id", "tag_id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");

ALTER TABLE ONLY "public"."reactions"
    ADD CONSTRAINT "reactions_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."reactions"
    ADD CONSTRAINT "reactions_pkey" PRIMARY KEY ("user_id", "post_id", "id");

ALTER TABLE ONLY "public"."readLater"
    ADD CONSTRAINT "read_later_pkey" PRIMARY KEY ("user_id", "rss_link");

ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_pkey" PRIMARY KEY ("user_id", "post_id");

ALTER TABLE ONLY "public"."rss"
    ADD CONSTRAINT "rss_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."rss"
    ADD CONSTRAINT "rss_link_key" UNIQUE ("link");

ALTER TABLE ONLY "public"."rss"
    ADD CONSTRAINT "rss_pkey" PRIMARY KEY ("link");

ALTER TABLE ONLY "public"."stripe_customers"
    ADD CONSTRAINT "stripe_customers_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_plan"
    ADD CONSTRAINT "user_plan_pkey" PRIMARY KEY ("user_id", "plan_id");

ALTER TABLE ONLY "public"."following"
    ADD CONSTRAINT "following_user_follow_id_fkey" FOREIGN KEY ("user_follow_id") REFERENCES "public"."profiles"("user_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."following"
    ADD CONSTRAINT "following_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."posts_saved"
    ADD CONSTRAINT "posts_saved_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."posts_saved"
    ADD CONSTRAINT "posts_saved_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."posts_tags"
    ADD CONSTRAINT "posts_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."posts_tags"
    ADD CONSTRAINT "posts_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."reactions"
    ADD CONSTRAINT "reactions_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."reactions"
    ADD CONSTRAINT "reactions_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."reactions"
    ADD CONSTRAINT "reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."readLater"
    ADD CONSTRAINT "readLater_rss_link_fkey" FOREIGN KEY ("rss_link") REFERENCES "public"."rss"("link") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."readLater"
    ADD CONSTRAINT "readLater_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."rss"
    ADD CONSTRAINT "rss_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_plan"
    ADD CONSTRAINT "user_plan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

CREATE POLICY "Enable all access for all users" ON "public"."rss" TO "authenticated" USING (true);

CREATE POLICY "Enable delete for users based on user_id" ON "public"."following" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."posts_saved" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."posts_tags" FOR DELETE TO "authenticated" USING (("auth"."uid"() IN ( SELECT "posts"."user_id"
   FROM "public"."posts"
  WHERE ("posts"."user_id" = "posts"."user_id"))));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."following" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."posts" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."posts_saved" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."posts_tags" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."reactions" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."reports" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."stripe_customers" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."tags" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for users based on user_id" ON "public"."user_plan" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable read access based on user_id" ON "public"."user_plan" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable read access for all users" ON "public"."following" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."posts" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."posts_saved" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."posts_tags" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."reactions" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."readLater" TO "authenticated" USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."stripe_customers" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."tags" FOR SELECT USING (true);

CREATE POLICY "Enable update for users authenticated" ON "public"."reactions" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);

CREATE POLICY "Enable update for users based on user_id" ON "public"."posts" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "user_id"));

ALTER TABLE "public"."following" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."posts_saved" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."posts_tags" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."reactions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."readLater" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."reports" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."rss" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."stripe_customers" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_plan" ENABLE ROW LEVEL SECURITY;

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."get_random_ad"("excluded_posts" "uuid"[], "privileged_users" "uuid"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."get_random_ad"("excluded_posts" "uuid"[], "privileged_users" "uuid"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_random_ad"("excluded_posts" "uuid"[], "privileged_users" "uuid"[]) TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON FUNCTION "public"."get_random_profiles2"("authenticated_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_random_profiles2"("authenticated_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_random_profiles2"("authenticated_user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_reactions_by_user"("authenticated_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_reactions_by_user"("authenticated_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_reactions_by_user"("authenticated_user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."reactions_not_seen"("authenticated_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."reactions_not_seen"("authenticated_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."reactions_not_seen"("authenticated_user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."search_posts"("keyword" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."search_posts"("keyword" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_posts"("keyword" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."search_users"("keyword" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."search_users"("keyword" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_users"("keyword" "text") TO "service_role";

GRANT ALL ON TABLE "public"."following" TO "anon";
GRANT ALL ON TABLE "public"."following" TO "authenticated";
GRANT ALL ON TABLE "public"."following" TO "service_role";

GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";

GRANT ALL ON TABLE "public"."posts_saved" TO "anon";
GRANT ALL ON TABLE "public"."posts_saved" TO "authenticated";
GRANT ALL ON TABLE "public"."posts_saved" TO "service_role";

GRANT ALL ON TABLE "public"."posts_tags" TO "anon";
GRANT ALL ON TABLE "public"."posts_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."posts_tags" TO "service_role";

GRANT ALL ON TABLE "public"."reactions" TO "anon";
GRANT ALL ON TABLE "public"."reactions" TO "authenticated";
GRANT ALL ON TABLE "public"."reactions" TO "service_role";

GRANT ALL ON SEQUENCE "public"."reactions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."reactions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."reactions_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."readLater" TO "anon";
GRANT ALL ON TABLE "public"."readLater" TO "authenticated";
GRANT ALL ON TABLE "public"."readLater" TO "service_role";

GRANT ALL ON TABLE "public"."reports" TO "anon";
GRANT ALL ON TABLE "public"."reports" TO "authenticated";
GRANT ALL ON TABLE "public"."reports" TO "service_role";

GRANT ALL ON TABLE "public"."rss" TO "anon";
GRANT ALL ON TABLE "public"."rss" TO "authenticated";
GRANT ALL ON TABLE "public"."rss" TO "service_role";

GRANT ALL ON SEQUENCE "public"."rss_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."rss_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."rss_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."stripe_customers" TO "anon";
GRANT ALL ON TABLE "public"."stripe_customers" TO "authenticated";
GRANT ALL ON TABLE "public"."stripe_customers" TO "service_role";

GRANT ALL ON TABLE "public"."tags" TO "anon";
GRANT ALL ON TABLE "public"."tags" TO "authenticated";
GRANT ALL ON TABLE "public"."tags" TO "service_role";

GRANT ALL ON SEQUENCE "public"."tags_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tags_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tags_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."top_10_posts" TO "anon";
GRANT ALL ON TABLE "public"."top_10_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."top_10_posts" TO "service_role";

GRANT ALL ON TABLE "public"."top_10_tags" TO "anon";
GRANT ALL ON TABLE "public"."top_10_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."top_10_tags" TO "service_role";

GRANT ALL ON TABLE "public"."trends_tags" TO "anon";
GRANT ALL ON TABLE "public"."trends_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."trends_tags" TO "service_role";

GRANT ALL ON TABLE "public"."user_plan" TO "anon";
GRANT ALL ON TABLE "public"."user_plan" TO "authenticated";
GRANT ALL ON TABLE "public"."user_plan" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
