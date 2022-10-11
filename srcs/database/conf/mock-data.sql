--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

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

--
-- Name: ChannelType; Type: TYPE; Schema: public; Owner: transcendence
--

CREATE TYPE public."ChannelType" AS ENUM (
    'PUBLIC',
    'PRIVATE',
    'PROTECTED',
    'DIRECT'
);


ALTER TYPE public."ChannelType" OWNER TO transcendence;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: transcendence
--

CREATE TYPE public."UserRole" AS ENUM (
    'OWNER',
    'ADMIN',
    'USER'
);


ALTER TYPE public."UserRole" OWNER TO transcendence;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Achievement; Type: TABLE; Schema: public; Owner: transcendence
--

CREATE TABLE public."Achievement" (
    id integer NOT NULL,
    name timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Achievement" OWNER TO transcendence;

--
-- Name: Achievement_id_seq; Type: SEQUENCE; Schema: public; Owner: transcendence
--

CREATE SEQUENCE public."Achievement_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Achievement_id_seq" OWNER TO transcendence;

--
-- Name: Achievement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: transcendence
--

ALTER SEQUENCE public."Achievement_id_seq" OWNED BY public."Achievement".id;


--
-- Name: Channel; Type: TABLE; Schema: public; Owner: transcendence
--

CREATE TABLE public."Channel" (
    id integer NOT NULL,
    name text NOT NULL,
    password text,
    "ownerId" integer NOT NULL,
    type public."ChannelType" NOT NULL
);


ALTER TABLE public."Channel" OWNER TO transcendence;

--
-- Name: Channel_id_seq; Type: SEQUENCE; Schema: public; Owner: transcendence
--

CREATE SEQUENCE public."Channel_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Channel_id_seq" OWNER TO transcendence;

--
-- Name: Channel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: transcendence
--

ALTER SEQUENCE public."Channel_id_seq" OWNED BY public."Channel".id;


--
-- Name: Credentials; Type: TABLE; Schema: public; Owner: transcendence
--

CREATE TABLE public."Credentials" (
    email text NOT NULL,
    username text NOT NULL,
    password text,
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "twoFactorActivated" boolean DEFAULT false NOT NULL,
    "twoFactorSecret" text
);


ALTER TABLE public."Credentials" OWNER TO transcendence;

--
-- Name: Credentials_id_seq; Type: SEQUENCE; Schema: public; Owner: transcendence
--

CREATE SEQUENCE public."Credentials_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Credentials_id_seq" OWNER TO transcendence;

--
-- Name: Credentials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: transcendence
--

ALTER SEQUENCE public."Credentials_id_seq" OWNED BY public."Credentials".id;


--
-- Name: Friendship; Type: TABLE; Schema: public; Owner: transcendence
--

CREATE TABLE public."Friendship" (
    "requesterId" integer NOT NULL,
    "addresseeId" integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Friendship" OWNER TO transcendence;

--
-- Name: Match; Type: TABLE; Schema: public; Owner: transcendence
--

CREATE TABLE public."Match" (
    id integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Match" OWNER TO transcendence;

--
-- Name: Match_id_seq; Type: SEQUENCE; Schema: public; Owner: transcendence
--

CREATE SEQUENCE public."Match_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Match_id_seq" OWNER TO transcendence;

--
-- Name: Match_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: transcendence
--

ALTER SEQUENCE public."Match_id_seq" OWNED BY public."Match".id;


--
-- Name: PlayerOnMatch; Type: TABLE; Schema: public; Owner: transcendence
--

CREATE TABLE public."PlayerOnMatch" (
    "matchId" integer NOT NULL,
    "playerId" integer NOT NULL,
    status integer,
    score integer DEFAULT 0 NOT NULL,
    side integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."PlayerOnMatch" OWNER TO transcendence;

--
-- Name: Rating; Type: TABLE; Schema: public; Owner: transcendence
--

CREATE TABLE public."Rating" (
    id integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    rating integer NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public."Rating" OWNER TO transcendence;

--
-- Name: Rating_id_seq; Type: SEQUENCE; Schema: public; Owner: transcendence
--

CREATE SEQUENCE public."Rating_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Rating_id_seq" OWNER TO transcendence;

--
-- Name: Rating_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: transcendence
--

ALTER SEQUENCE public."Rating_id_seq" OWNED BY public."Rating".id;


--
-- Name: Stats; Type: TABLE; Schema: public; Owner: transcendence
--

CREATE TABLE public."Stats" (
    id integer NOT NULL,
    wins integer DEFAULT 0 NOT NULL,
    losses integer DEFAULT 0 NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public."Stats" OWNER TO transcendence;

--
-- Name: Stats_id_seq; Type: SEQUENCE; Schema: public; Owner: transcendence
--

CREATE SEQUENCE public."Stats_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Stats_id_seq" OWNER TO transcendence;

--
-- Name: Stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: transcendence
--

ALTER SEQUENCE public."Stats_id_seq" OWNED BY public."Stats".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: transcendence
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    username text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "currentStatus" integer DEFAULT 1 NOT NULL,
    "profilePicture" text,
    "eloRating" integer DEFAULT 1000 NOT NULL
);


ALTER TABLE public."User" OWNER TO transcendence;

--
-- Name: UserAchievement; Type: TABLE; Schema: public; Owner: transcendence
--

CREATE TABLE public."UserAchievement" (
    "achievementId" integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public."UserAchievement" OWNER TO transcendence;

--
-- Name: UserOnChannel; Type: TABLE; Schema: public; Owner: transcendence
--

CREATE TABLE public."UserOnChannel" (
    "channelId" integer NOT NULL,
    "userId" integer NOT NULL,
    role public."UserRole" NOT NULL,
    "joinedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isBanned" boolean DEFAULT false NOT NULL,
    "isMuted" boolean DEFAULT false NOT NULL,
    "hasLeftChannel" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."UserOnChannel" OWNER TO transcendence;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: transcendence
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO transcendence;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: transcendence
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: transcendence
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO transcendence;

--
-- Name: Achievement id; Type: DEFAULT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."Achievement" ALTER COLUMN id SET DEFAULT nextval('public."Achievement_id_seq"'::regclass);


--
-- Name: Channel id; Type: DEFAULT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."Channel" ALTER COLUMN id SET DEFAULT nextval('public."Channel_id_seq"'::regclass);


--
-- Name: Credentials id; Type: DEFAULT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."Credentials" ALTER COLUMN id SET DEFAULT nextval('public."Credentials_id_seq"'::regclass);


--
-- Name: Match id; Type: DEFAULT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."Match" ALTER COLUMN id SET DEFAULT nextval('public."Match_id_seq"'::regclass);


--
-- Name: Rating id; Type: DEFAULT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."Rating" ALTER COLUMN id SET DEFAULT nextval('public."Rating_id_seq"'::regclass);


--
-- Name: Stats id; Type: DEFAULT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."Stats" ALTER COLUMN id SET DEFAULT nextval('public."Stats_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Achievement; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public."Achievement" (id, name) FROM stdin;
\.


--
-- Data for Name: Channel; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public."Channel" (id, name, password, "ownerId", type) FROM stdin;
29	ok	lol	2	PROTECTED
\.


--
-- Data for Name: Credentials; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public."Credentials" (email, username, password, id, "userId", "twoFactorActivated", "twoFactorSecret") FROM stdin;
nammari@student.42.fr	nammari	\N	1	3	f	\N
\.


--
-- Data for Name: Friendship; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public."Friendship" ("requesterId", "addresseeId", date, status) FROM stdin;
1	2	2022-09-24 07:39:51.107	1
3	2	2022-10-02 21:39:45.697	1
1	3	2022-10-02 21:40:00.37	1
6	3	2022-10-04 07:36:06.462	1
3	5	2022-10-04 07:36:11.446	0
3	4	2022-10-04 07:36:17.973	1
4	5	2022-10-04 07:36:27.493	0
4	2	2022-10-04 07:36:30.47	0
4	1	2022-10-04 07:36:37.402	1
1	5	2022-10-04 07:36:45.008	1
6	1	2022-10-04 07:36:51.817	1
\.


--
-- Data for Name: Match; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public."Match" (id, date) FROM stdin;
\.


--
-- Data for Name: PlayerOnMatch; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public."PlayerOnMatch" ("matchId", "playerId", status, score, side) FROM stdin;
\.


--
-- Data for Name: Rating; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public."Rating" (id, date, rating, "userId") FROM stdin;
1	2022-09-24 07:37:40.267	1000	1
2	2022-09-24 07:38:10.28	1000	2
3	2022-10-02 21:38:02.243	1000	3
4	2022-10-04 07:34:16.113	1000	4
5	2022-10-04 07:34:32.315	1000	5
6	2022-10-04 07:34:44.845	1000	6
\.


--
-- Data for Name: Stats; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public."Stats" (id, wins, losses, "userId") FROM stdin;
1	0	0	1
2	0	0	2
3	0	0	3
4	0	0	4
5	0	0	5
6	0	0	6
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public."User" (id, email, username, "createdAt", "currentStatus", "profilePicture", "eloRating") FROM stdin;
1	homer@springfield.com	homer	2022-09-24 07:37:40.267	1	http://site.com/image.png	1000
2	noufel@springfield.com	noufel	2022-09-24 07:38:10.28	1	http://site.com/image.png	1000
3	nammari@student.42.fr	nammari	2022-10-02 21:38:02.243	1	https://cdn.intra.42.fr/users/nammari.jpg	1000
4	boomer@springfield.com	Boomer	2022-10-04 07:34:16.113	1	http://site.com/image.png	1000
5	monaliza@springfield.com	MonaLiza	2022-10-04 07:34:32.315	1	http://site.com/image.png	1000
6	toto@springfield.com	toto	2022-10-04 07:34:44.845	1	http://site.com/image.png	1000
\.


--
-- Data for Name: UserAchievement; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public."UserAchievement" ("achievementId", date, "userId") FROM stdin;
\.


--
-- Data for Name: UserOnChannel; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public."UserOnChannel" ("channelId", "userId", role, "joinedAt", "isBanned", "isMuted", "hasLeftChannel") FROM stdin;
29	2	OWNER	2022-10-03 07:07:43.563	f	f	f
29	3	USER	2022-10-03 18:33:02.292	f	f	f
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
57df9da9-7a77-4f93-bbe5-753f01718d83	61768f1ee045e16d972f39b675934653f555c228e71cb100a1995aba070e92f8	2022-09-22 10:05:01.802006+00	20220818160459_	\N	\N	2022-09-22 10:05:01.76541+00	1
bbc97581-3d4e-485f-851c-a2b4319c888d	490183f29a4b3202cefb25a2cc95b1fef5db3e5d3458730d34f8ee7086a5ab34	2022-09-22 10:05:02.039668+00	20220829162558_renaming_current_ladder	\N	\N	2022-09-22 10:05:02.034286+00	1
ebb6daad-a822-49f0-ae25-9cae50157208	a3bd7ed9198faa1f51bd2792ddb88b1153076ef76b1b3ad695e15bfe5f1f84f8	2022-09-22 10:05:01.898193+00	20220822143211_first_complete_schema	\N	\N	2022-09-22 10:05:01.803588+00	1
cd943d3d-87a3-4a54-942a-65dfd77c8c02	ea34fa85e9399b32eb5a8a94d8dd253f1d05533fa2fa6e390162fef2ed708c2f	2022-09-22 10:05:01.907081+00	20220823154942_added_cascade_on_delete_user	\N	\N	2022-09-22 10:05:01.899991+00	1
368155f8-5939-4ede-9786-0dd1b95be6e9	41b4e03a15fa1346a2f150b822e98cef9d5d19d8a0c76705439f3daacbd3f110	2022-09-22 10:05:01.9179+00	20220823155140_fix_previous_mistake	\N	\N	2022-09-22 10:05:01.908415+00	1
4ba152ec-80dc-4a67-9756-7d50dfb8632f	72e4f669aafacd12f1c8410c125a60e7d041919ef01ee58714f12fc7130dcc2a	2022-09-22 10:05:02.047896+00	20220829162731_updating_defaut_current_status	\N	\N	2022-09-22 10:05:02.040965+00	1
9eca7d89-dcdf-4f15-871a-152d1aaae7ae	b1e6d53c2c65eafc2215053476367949effe4d6392dd227b19d20a74756bcfb9	2022-09-22 10:05:01.938942+00	20220824094033_changing_friendship_relation	\N	\N	2022-09-22 10:05:01.919653+00	1
59d31bd6-390f-4dc7-95ab-1c41d2065ecd	aabdf0be4efaa9fbd0c8f5f16bd9154fb082370e35a0ff80bf97085e616d4872	2022-09-22 10:05:01.963144+00	20220826092857_adding_2fa_and_updating_achievement	\N	\N	2022-09-22 10:05:01.940724+00	1
da1baef7-f277-4e5a-b191-521948abdce1	6c665ebc8186a083b69593db683d97962c6d9610521c6a895a4cef962ceed734	2022-09-22 10:05:01.969792+00	20220826103150_	\N	\N	2022-09-22 10:05:01.964592+00	1
795d62f5-9068-4a23-a33f-c06fb456b1a3	5de02f64d051616d0835b86313fad8d0b7e4cf4a51cfb4a47917d596d0574c32	2022-09-22 10:05:02.05424+00	20220829163227_updating_defaut_match_status	\N	\N	2022-09-22 10:05:02.049179+00	1
afaee3cf-bc25-44f9-89c9-c5edcf3d787c	fc60378ebeee476dac768b35e23b1e77dd8ce9abc28672d171faffcacf6fbbe5	2022-09-22 10:05:01.97624+00	20220826105618_	\N	\N	2022-09-22 10:05:01.971014+00	1
c8df87bf-4b26-453e-b5a6-96ec69249326	b6ba361a65595272e929dadb40382742b7a83a3249d7131da26d69d646ed5ae3	2022-09-22 10:05:01.992088+00	20220826162153_user_friendship_to_friendship	\N	\N	2022-09-22 10:05:01.977695+00	1
5b391aa6-5c2f-411b-8c0a-9cce3d82b117	d1591ced20812fea24c2579e429ff28a0a32dbd345c5ac7e1f608961100af61e	2022-09-22 10:05:02.011295+00	20220827134504_	\N	\N	2022-09-22 10:05:01.993529+00	1
73889cb8-13f3-42cd-9a7a-46d18b9031fc	ab8fe9f44ccd368bb2f81e61047be5868dfe7a51a567670b8317f4c2e6848e60	2022-09-22 10:05:02.073313+00	20220830105140_replacing_rank_with_rating	\N	\N	2022-09-22 10:05:02.055721+00	1
c8764789-4c29-49bf-a937-6c5b64de9146	7ce1b83763886480f14256aee14be5d15b0f3634f767c29e691031810e48af97	2022-09-22 10:05:02.01993+00	20220828095950_	\N	\N	2022-09-22 10:05:02.013438+00	1
899b9c01-012a-47e4-98cd-0dcb3b89f862	cf67f5270761ced53fa25c9e8f60f6a07841ddc237d2caeb640af777713fc17d	2022-09-22 10:05:02.026567+00	20220829125333_win_probability_on_players	\N	\N	2022-09-22 10:05:02.021428+00	1
7b6c55fa-d04b-4b26-871f-3bbacfc21478	41020e4ed4aea7e72036149f24c0925a698b4407ac9a190c57808d2d4e307e5f	2022-09-22 10:05:02.032896+00	20220829150217_default_user_status_1	\N	\N	2022-09-22 10:05:02.027905+00	1
63f9a900-239c-4a1b-ba0b-9ca85f119769	e8f6bf33fe4fe39614a6728a0f25b7468076f7264eeb4de083b2370928f5fb2d	2022-09-22 10:05:02.082054+00	20220830134617_fixing_unique_contraints	\N	\N	2022-09-22 10:05:02.075358+00	1
f97ba7ea-ff59-44c9-98de-7fc955595f57	d95f6c19aad293a2bc5aa224020ec137f6a2d2e56c1daf8e531b2b36ca8a4a9b	2022-09-22 10:05:02.101971+00	20220831080803_fk_constraints_update	\N	\N	2022-09-22 10:05:02.083633+00	1
b8d96efc-2e44-40de-94be-592eed25fd30	e696236c820b38e20e3865f269f405da106a39a5543759c2ab6ef2526b1df3d8	2022-10-02 21:37:27.1419+00	20221001081318_banned_users_id_added_migration	\N	\N	2022-10-02 21:37:27.137541+00	1
0e448563-fab6-4b8e-b1f6-1572a7546b6d	bbaf139c703093eee860f5cc2b35cd8a221dee6cb554aed3593048f14dbb462a	2022-10-02 21:37:27.096803+00	20220909153655_updating_players_on_match_sides	\N	\N	2022-10-02 21:37:27.090492+00	1
1d3ebfa9-989f-4c17-bebc-d233d5ee3359	6a46d9cb192c1190da0962f9549272486a1ff6610389deee6aacda864caf8e15	2022-10-02 21:37:27.104093+00	20220909154704_simplifying_attribute_names	\N	\N	2022-10-02 21:37:27.098089+00	1
7b6e4816-d4f6-43d6-ad9e-d41f28f3531f	9aba9bf94ebe8288e6913462684106b797e265c9c18c45369d2de431dc7d38f7	2022-10-02 21:37:27.111147+00	20220910074815_	\N	\N	2022-10-02 21:37:27.105745+00	1
80fef73a-a6c0-40f5-8dff-3fea880cb1e1	a3cc469bf55138c3233034710ac4d87c3361c323fe77bbbd593eb825b9d781bc	2022-10-02 21:37:27.148262+00	20221001091748_has_left_the_channel_migration	\N	\N	2022-10-02 21:37:27.143312+00	1
09a83ef7-660d-4b88-8f43-281acc4db55c	b0e99c8b992ad609f7699602edd83c21bbda6a5aa0fada73dc48e24550807c4c	2022-10-02 21:37:27.120415+00	20220925161438_channel_migration	\N	\N	2022-10-02 21:37:27.11266+00	1
b82cecff-cfcc-43e0-a062-a0bab369fd86	d8fac66e1e3d32cc8b1cdb700e991444fcd441f3b6b12b0b6c904ec3f4427071	2022-10-02 21:37:27.129942+00	20220925214259_channel_migration_enum_and_date	\N	\N	2022-10-02 21:37:27.121899+00	1
f4caa299-2b1e-4dbd-bdcf-2877458cb2cd	a3cce64a7325c393527057730eca8c07612ad66f245599ce0cbf7a68ecfab429	2022-10-02 21:37:27.136177+00	20220926091517_channel_migration_joined_at	\N	\N	2022-10-02 21:37:27.131281+00	1
29e31e52-8634-4db6-9a5f-923e6550769b	3aff01f80c9bf1ce2f0081da55ca3428c3f72366f1ba5482ee7f5f5918b8155c	2022-10-02 21:37:27.15549+00	20221001113614_is_banned_is_muted	\N	\N	2022-10-02 21:37:27.149564+00	1
335b23e5-2747-4504-b60a-3101bb78b75b	e127f38397cd7e912c6dfe78df88265af68faeabb6a9c60cc22a4efe05c90570	2022-10-02 21:37:27.162265+00	20221001115615_	\N	\N	2022-10-02 21:37:27.15691+00	1
\.


--
-- Name: Achievement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: transcendence
--

SELECT pg_catalog.setval('public."Achievement_id_seq"', 1, false);


--
-- Name: Channel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: transcendence
--

SELECT pg_catalog.setval('public."Channel_id_seq"', 29, true);


--
-- Name: Credentials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: transcendence
--

SELECT pg_catalog.setval('public."Credentials_id_seq"', 1, true);


--
-- Name: Match_id_seq; Type: SEQUENCE SET; Schema: public; Owner: transcendence
--

SELECT pg_catalog.setval('public."Match_id_seq"', 1, false);


--
-- Name: Rating_id_seq; Type: SEQUENCE SET; Schema: public; Owner: transcendence
--

SELECT pg_catalog.setval('public."Rating_id_seq"', 6, true);


--
-- Name: Stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: transcendence
--

SELECT pg_catalog.setval('public."Stats_id_seq"', 6, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: transcendence
--

SELECT pg_catalog.setval('public."User_id_seq"', 6, true);


--
-- Name: Achievement Achievement_pkey; Type: CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."Achievement"
    ADD CONSTRAINT "Achievement_pkey" PRIMARY KEY (id);


--
-- Name: Channel Channel_pkey; Type: CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."Channel"
    ADD CONSTRAINT "Channel_pkey" PRIMARY KEY (id);


--
-- Name: Credentials Credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."Credentials"
    ADD CONSTRAINT "Credentials_pkey" PRIMARY KEY (id);


--
-- Name: Friendship Friendship_pkey; Type: CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."Friendship"
    ADD CONSTRAINT "Friendship_pkey" PRIMARY KEY ("requesterId", "addresseeId");


--
-- Name: Match Match_pkey; Type: CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_pkey" PRIMARY KEY (id);


--
-- Name: PlayerOnMatch PlayerOnMatch_pkey; Type: CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."PlayerOnMatch"
    ADD CONSTRAINT "PlayerOnMatch_pkey" PRIMARY KEY ("matchId", "playerId");


--
-- Name: Rating Rating_pkey; Type: CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."Rating"
    ADD CONSTRAINT "Rating_pkey" PRIMARY KEY (id);


--
-- Name: Stats Stats_pkey; Type: CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."Stats"
    ADD CONSTRAINT "Stats_pkey" PRIMARY KEY (id);


--
-- Name: UserAchievement UserAchievement_pkey; Type: CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."UserAchievement"
    ADD CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("achievementId", "userId");


--
-- Name: UserOnChannel UserOnChannel_pkey; Type: CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."UserOnChannel"
    ADD CONSTRAINT "UserOnChannel_pkey" PRIMARY KEY ("channelId", "userId");


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Credentials_email_key; Type: INDEX; Schema: public; Owner: transcendence
--

CREATE UNIQUE INDEX "Credentials_email_key" ON public."Credentials" USING btree (email);


--
-- Name: Credentials_userId_key; Type: INDEX; Schema: public; Owner: transcendence
--

CREATE UNIQUE INDEX "Credentials_userId_key" ON public."Credentials" USING btree ("userId");


--
-- Name: Credentials_username_key; Type: INDEX; Schema: public; Owner: transcendence
--

CREATE UNIQUE INDEX "Credentials_username_key" ON public."Credentials" USING btree (username);


--
-- Name: Stats_userId_key; Type: INDEX; Schema: public; Owner: transcendence
--

CREATE UNIQUE INDEX "Stats_userId_key" ON public."Stats" USING btree ("userId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: transcendence
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: transcendence
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: Channel Channel_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."Channel"
    ADD CONSTRAINT "Channel_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Credentials Credentials_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."Credentials"
    ADD CONSTRAINT "Credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Friendship Friendship_addresseeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."Friendship"
    ADD CONSTRAINT "Friendship_addresseeId_fkey" FOREIGN KEY ("addresseeId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Friendship Friendship_requesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."Friendship"
    ADD CONSTRAINT "Friendship_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PlayerOnMatch PlayerOnMatch_matchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."PlayerOnMatch"
    ADD CONSTRAINT "PlayerOnMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES public."Match"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PlayerOnMatch PlayerOnMatch_playerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."PlayerOnMatch"
    ADD CONSTRAINT "PlayerOnMatch_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Rating Rating_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."Rating"
    ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Stats Stats_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."Stats"
    ADD CONSTRAINT "Stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserAchievement UserAchievement_achievementId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."UserAchievement"
    ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES public."Achievement"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserAchievement UserAchievement_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."UserAchievement"
    ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserOnChannel UserOnChannel_channelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."UserOnChannel"
    ADD CONSTRAINT "UserOnChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES public."Channel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserOnChannel UserOnChannel_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendence
--

ALTER TABLE ONLY public."UserOnChannel"
    ADD CONSTRAINT "UserOnChannel_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

