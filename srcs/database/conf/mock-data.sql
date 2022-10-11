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
    "channelMode" integer DEFAULT 0 NOT NULL,
    password text,
    "ownerId" integer NOT NULL
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
    mode integer DEFAULT 0 NOT NULL
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

COPY public."Channel" (id, name, "channelMode", password, "ownerId") FROM stdin;
\.


--
-- Data for Name: Credentials; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public."Credentials" (email, username, password, id, "userId", "twoFactorActivated", "twoFactorSecret") FROM stdin;
\.


--
-- Data for Name: Friendship; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public."Friendship" ("requesterId", "addresseeId", date, status) FROM stdin;
38	33	2022-10-11 14:25:44.192	1
8	33	2022-10-11 14:25:44.574	1
6	33	2022-10-11 14:25:45.429	1
10	29	2022-10-11 14:26:43.437	1
8	29	2022-10-11 14:26:43.834	1
6	29	2022-10-11 14:26:44.433	1
10	6	2022-10-11 14:28:28.299	1
6	26	2022-10-11 14:29:31.786	1
6	37	2022-10-11 14:29:34.78	1
10	37	2022-10-11 14:29:35.563	1
25	6	2022-10-11 14:30:14.476	0
25	37	2022-10-11 14:30:52.091	1
9	6	2022-10-11 14:31:16.242	1
37	9	2022-10-11 14:32:09.925	1
2	9	2022-10-11 14:32:21.693	0
33	25	2022-10-11 14:32:24.966	0
10	15	2022-10-11 14:32:41.91	0
33	2	2022-10-11 14:32:53.324	0
26	33	2022-10-11 14:33:01.599	0
26	2	2022-10-11 14:33:48.765	1
25	26	2022-10-11 14:34:01.354	1
33	10	2022-10-11 14:35:08.222	1
32	10	2022-10-11 14:35:08.682	1
35	10	2022-10-11 14:35:09.371	1
25	10	2022-10-11 14:35:09.978	1
36	10	2022-10-11 14:35:10.428	1
3	10	2022-10-11 14:35:11.259	1
16	10	2022-10-11 14:35:14.791	1
22	10	2022-10-11 14:38:43.394	1
21	10	2022-10-11 14:38:44.491	1
24	10	2022-10-11 14:38:45.531	1
\.


--
-- Data for Name: Match; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public."Match" (id, date) FROM stdin;
1	2022-10-11 14:25:51.164
2	2022-10-11 14:26:26.321
3	2022-10-11 14:26:48.964
4	2022-10-11 14:27:09.28
5	2022-10-11 14:28:19.962
6	2022-10-11 14:28:38.321
7	2022-10-11 14:29:18.588
8	2022-10-11 14:29:22.377
9	2022-10-11 14:30:20.908
10	2022-10-11 14:30:36.31
11	2022-10-11 14:30:46.795
12	2022-10-11 14:30:58.146
13	2022-10-11 14:31:07.601
14	2022-10-11 14:31:39.794
15	2022-10-11 14:32:14.389
16	2022-10-11 14:33:09.314
17	2022-10-11 14:33:27.016
18	2022-10-11 14:33:34.679
19	2022-10-11 14:33:40.576
20	2022-10-11 14:35:22.197
21	2022-10-11 14:35:32.394
22	2022-10-11 14:35:42.975
23	2022-10-11 14:35:53.07
24	2022-10-11 14:36:56.377
25	2022-10-11 14:37:11.209
26	2022-10-11 14:38:58.021
27	2022-10-11 14:39:09.031
28	2022-10-11 14:39:22.195
\.


--
-- Data for Name: PlayerOnMatch; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public."PlayerOnMatch" ("matchId", "playerId", status, score, side) FROM stdin;
1	33	2	4	0
1	38	0	0	1
2	29	2	0	0
2	8	0	0	1
3	29	2	0	0
3	10	0	2	1
4	29	0	1	0
4	6	2	0	1
5	37	2	6	0
5	6	0	0	1
6	10	2	3	0
6	37	0	0	1
7	26	2	4	0
7	37	0	0	1
8	10	2	1	0
8	6	0	0	1
9	6	0	3	0
9	37	2	0	1
10	37	0	0	0
10	25	2	0	1
11	6	0	0	0
11	9	2	0	1
12	37	0	0	0
12	25	2	0	1
13	6	0	0	0
13	9	2	0	1
14	9	0	1	0
14	25	2	0	1
15	9	2	1	0
15	25	0	2	1
16	2	0	3	0
16	33	2	0	1
17	10	2	0	0
17	2	0	1	1
18	26	0	0	0
18	33	2	0	1
19	2	0	0	0
19	10	2	0	1
20	10	0	0	0
20	33	2	0	1
21	2	2	0	0
21	33	0	0	1
22	10	0	0	0
22	2	2	0	1
23	10	0	0	0
23	2	2	0	1
24	10	0	0	0
24	31	2	0	1
25	10	0	0	0
25	33	2	0	1
26	14	0	0	0
26	10	2	0	1
27	16	0	0	0
27	10	2	0	1
28	10	0	0	0
28	7	2	0	1
\.


--
-- Data for Name: Rating; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public."Rating" (id, date, rating, "userId") FROM stdin;
1	2022-10-11 14:19:09.428	1000	18
2	2022-10-11 14:19:19.562	1000	26
3	2022-10-11 14:19:24.786	1000	25
4	2022-10-11 14:19:44.443	1000	38
5	2022-10-11 14:19:47.546	1000	27
6	2022-10-11 14:19:47.958	1000	16
7	2022-10-11 14:19:48.523	1000	0
8	2022-10-11 14:19:48.877	1000	6
9	2022-10-11 14:19:49.261	1000	15
10	2022-10-11 14:19:49.519	1000	13
11	2022-10-11 14:19:49.856	1000	10
12	2022-10-11 14:19:50.321	1000	4
13	2022-10-11 14:19:51.238	1000	2
14	2022-10-11 14:19:51.714	1000	23
15	2022-10-11 14:19:52.209	1000	28
16	2022-10-11 14:19:52.811	1000	14
17	2022-10-11 14:19:53.238	1000	12
18	2022-10-11 14:19:53.618	1000	21
19	2022-10-11 14:20:49.812	1000	30
20	2022-10-11 14:20:50.485	1000	37
21	2022-10-11 14:20:50.826	1000	3
22	2022-10-11 14:20:51.161	1000	9
23	2022-10-11 14:20:52.398	1000	17
24	2022-10-11 14:20:52.728	1000	33
25	2022-10-11 14:20:56.983	1000	35
26	2022-10-11 14:20:57.351	1000	31
27	2022-10-11 14:21:01.752	1000	1
28	2022-10-11 14:21:02.101	1000	7
29	2022-10-11 14:21:03.205	1000	19
30	2022-10-11 14:21:04.553	1000	36
31	2022-10-11 14:21:06.675	1000	29
32	2022-10-11 14:21:08.278	1000	24
33	2022-10-11 14:21:10.657	1000	22
34	2022-10-11 14:21:15.756	1000	34
35	2022-10-11 14:21:17.125	1000	11
36	2022-10-11 14:21:17.455	1000	5
37	2022-10-11 14:21:21.365	1000	20
38	2022-10-11 14:21:26.138	1000	32
39	2022-10-11 14:21:43.337	1000	8
40	2022-10-11 14:21:52.036	1000	39
41	2022-10-11 14:25:51.211	984	33
42	2022-10-11 14:26:26.366	984	29
43	2022-10-11 14:26:49.019	969	29
44	2022-10-11 14:27:09.327	986	29
45	2022-10-11 14:28:20.004	983	37
46	2022-10-11 14:28:38.447	998	10
47	2022-10-11 14:29:18.636	984	26
48	2022-10-11 14:29:22.401	982	10
49	2022-10-11 14:30:20.943	1032	6
50	2022-10-11 14:30:36.341	1016	37
51	2022-10-11 14:30:46.816	1047	6
52	2022-10-11 14:30:58.182	1031	37
53	2022-10-11 14:31:07.673	1060	6
54	2022-10-11 14:31:39.823	988	9
55	2022-10-11 14:32:14.408	970	9
56	2022-10-11 14:33:09.346	1015	2
57	2022-10-11 14:33:27.049	968	10
58	2022-10-11 14:33:34.686	999	26
59	2022-10-11 14:33:40.603	1042	2
60	2022-10-11 14:35:22.22	971	10
61	2022-10-11 14:35:32.425	1021	2
62	2022-10-11 14:35:43.008	989	10
63	2022-10-11 14:35:53.108	1006	10
64	2022-10-11 14:36:56.398	1022	10
65	2022-10-11 14:37:11.231	1035	10
66	2022-10-11 14:38:58.054	1018	14
67	2022-10-11 14:39:09.053	1017	16
68	2022-10-11 14:39:22.211	1016	10
\.


--
-- Data for Name: Stats; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public."Stats" (id, wins, losses, "userId") FROM stdin;
1	0	0	18
5	0	0	27
7	0	0	0
9	0	0	15
10	0	0	13
12	0	0	4
14	0	0	23
15	0	0	28
17	0	0	12
18	0	0	21
19	0	0	30
21	0	0	3
23	0	0	17
25	0	0	35
27	0	0	1
29	0	0	19
30	0	0	36
32	0	0	24
33	0	0	22
34	0	0	34
35	0	0	11
36	0	0	5
37	0	0	20
38	0	0	32
40	0	0	39
4	1	0	38
39	1	0	8
31	1	2	29
20	4	2	37
8	5	1	6
22	1	3	9
3	1	3	25
2	1	1	26
13	3	3	2
26	0	1	31
24	1	5	33
16	1	0	14
6	1	0	16
11	7	6	10
28	0	1	7
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public."User" (id, email, username, "createdAt", "currentStatus", "profilePicture", "eloRating") FROM stdin;
18	Charles@student.42.fr	Charles	2022-10-11 14:19:09.428	1	https://images.generated.photos/JFtCZjjkIla2VkEn_p_uyxlKIFRYxk7eLs6ZOqkmmBY/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MjQ3OTcyLmpwZw.jpg	1000
27	Margaret@student.42.fr	Margaret	2022-10-11 14:19:47.546	1	https://images.generated.photos/OsCenipa-N1wPXUJN6BV24cRHlVK8OQEGN7daSkVyoE/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MzY2MjEwLmpwZw.jpg	1000
0	James@student.42.fr	James	2022-10-11 14:19:48.523	1	https://images.generated.photos/4Od-kWAc0hNx4m4T5KhLvz1Ift0srwsRLTvI4oMldmw/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MDgzNTA1LmpwZw.jpg	1000
15	Jessica@student.42.fr	Jessica	2022-10-11 14:19:49.261	1	https://images.generated.photos/ASMeHlaOOVfMR7eJbqB5WoSEi7wUONnc0DOITL9vcPg/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/NjU4MzYxLmpwZw.jpg	1000
13	Susan@student.42.fr	Susan	2022-10-11 14:19:49.519	1	https://images.generated.photos/y1zRFZ10Wo8IWwaCQqKbHHZTD1QCFEKZmGagiOb7IeA/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MjI3MjkyLmpwZw.jpg	1000
4	John@student.42.fr	John	2022-10-11 14:19:50.321	1	https://images.generated.photos/nR3paLO3GJ9nZ8at10gwa7HEW-w3ISFxHOMtyUcuSYI/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MTE5NDU0LmpwZw.jpg	1000
23	Nancy@student.42.fr	Nancy	2022-10-11 14:19:51.714	1	https://images.generated.photos/h0YykWUIgF8mZkSoQHC7kS2My50jnbej8rRunGGeEXA/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/NDc4ODgxLmpwZw.jpg	1000
28	Mark@student.42.fr	Mark	2022-10-11 14:19:52.209	1	https://images.generated.photos/fqEl7gAwaXLUsWdgSAHNPegj_lMeUBc8en9Ykr1t6I0/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/OTkxOTY3LmpwZw.jpg	1000
12	Richard@student.42.fr	Richard	2022-10-11 14:19:53.238	1	https://images.generated.photos/rArLkkDMMD09rM7pHX3DTFtDvCQhHA-HQ2CormAjbSE/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/OTM0NTk4LmpwZw.jpg	1000
21	Lisa@student.42.fr	Lisa	2022-10-11 14:19:53.618	1	https://images.generated.photos/fzcMISzRyPQF4X6MAAWL2EtU67msVJFWDuSiCu4k5K0/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MDc0MjQ5LmpwZw.jpg	1000
30	Donald@student.42.fr	Donald	2022-10-11 14:20:49.812	1	https://images.generated.photos/fqEl7gAwaXLUsWdgSAHNPegj_lMeUBc8en9Ykr1t6I0/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/OTkxOTY3LmpwZw.jpg	1000
3	Patricia@student.42.fr	Patricia	2022-10-11 14:20:50.826	1	https://images.generated.photos/HGzowU9zCtJZcWVVmcWo2dznQegznm0p5A1bTjfGet0/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/NzMwMTI0LmpwZw.jpg	1000
17	Sarah@student.42.fr	Sarah	2022-10-11 14:20:52.398	1	https://images.generated.photos/T64qfX-AaZl57i8kKwDUockGCh_6pv5t5iuxjdJy4JE/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/NzgxMTk0LmpwZw.jpg	1000
35	Emily@student.42.fr	Emily	2022-10-11 14:20:56.983	1	https://images.generated.photos/zUxhgecq1MqAsIx159Q6_3kqlqBEdn1mymdIYOhcf-o/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/NDk5NDQ5LmpwZw.jpg	1000
1	Mary@student.42.fr	Mary	2022-10-11 14:21:01.752	1	https://images.generated.photos/dbtao4sgdp3amV6JM5W1b_kz3-dgsGe64ESenOUg-XU/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/NDcwMTU1LmpwZw.jpg	1000
19	Karen@student.42.fr	Karen	2022-10-11 14:21:03.205	1	https://images.generated.photos/_PqZjpJcJRAjPRHMg1U_p_izUdSl6R8PjKUoJrVfLTQ/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/ODU4MTgxLmpwZw.jpg	1000
36	Andrew@student.42.fr	Andrew	2022-10-11 14:21:04.553	1	https://images.generated.photos/M7r5Y5V0KmM5g3AYHdxed1ss1XR4ehrHKciNTJXJnaw/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/NDIxNzQyLmpwZw.jpg	1000
24	Matthew@student.42.fr	Matthew	2022-10-11 14:21:08.278	1	https://images.generated.photos/Fx4MEsRQlH6poBU1Bwt3Mhbw-Hu7rWKXVdXtk4qy0DE/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MTk5ODkwLmpwZw.jpg	1000
38	Joshua@student.42.fr	Joshua	2022-10-11 14:19:44.443	1	https://images.generated.photos/2GnRbnslvHlvnxVxiNS55fhFH9G2D1xs-l-WO5UzO54/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MjA3Njk3LmpwZw.jpg	1016
31	Ashley@student.42.fr	Ashley	2022-10-11 14:20:57.351	1	https://images.generated.photos/KbZ7y2vp25gI56OD_w9a3qUWi-VhAXoBD1qsF-BuYWc/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MzIwNzA0LmpwZw.jpg	984
2	Robert@student.42.fr	Robert	2022-10-11 14:19:51.238	1	https://images.generated.photos/DPHjMFE2iXWf4AlkXWb3tWSSmDlg5otq97PMgyascp0/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/NjY1ODM3LmpwZw.jpg	986
29	Sandra@student.42.fr	Sandra	2022-10-11 14:21:06.675	1	https://images.generated.photos/R9wQajFWc47aq8WT8BKHveVVnufToNwc0OpcUKV7Rls/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/NjUxMTM5LmpwZw.jpg	986
26	Anthony@student.42.fr	Anthony	2022-10-11 14:19:19.562	1	https://images.generated.photos/JcVz-dGEMR9blf6DX7GR7f6f-lb4IIlk7IIcm2cTIpE/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MzkxNzc1LmpwZw.jpg	999
9	Elizabeth@student.42.fr	Elizabeth	2022-10-11 14:20:51.161	1	https://images.generated.photos/We84vY7xD6WG-zIgpqzubPgYbCc5_9WXOSuXcGvuH2o/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MDE4MjExLmpwZw.jpg	970
25	Betty@student.42.fr	Betty	2022-10-11 14:19:24.786	1	https://images.generated.photos/fVd_DM-ltVw1uXvJ5Cd-hrAGO2CbtySH3zCoVl-ZVuY/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MTYxMjM0LmpwZw.jpg	971
37	Donna@student.42.fr	Donna	2022-10-11 14:20:50.485	1	https://images.generated.photos/YY8GhhHC7nemRH9EjY6DuwFsqdHD5Yd_VUvvQVI5wQQ/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MTMzMDA5LmpwZw.jpg	1031
14	Joseph@student.42.fr	Joseph	2022-10-11 14:19:52.811	1	https://images.generated.photos/Z6ioZN1qUBl5DI-kWCYoYeogaYuY1t9IPj20SCSwLkI/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/ODEwMzQyLmpwZw.jpg	1018
16	Thomas@student.42.fr	Thomas	2022-10-11 14:19:47.958	1	https://images.generated.photos/67Lef0_qxjEOcZOINnNmd8qJtYlLauGbAQMU9jbXyfc/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MjkwODA0LmpwZw.jpg	1017
10	William@student.42.fr	William	2022-10-11 14:19:49.856	1	https://images.generated.photos/y5an99pO-Ct6CCs1USCu18XZXer4DBnQaQJEIYXZPvI/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/OTU0MDI0LmpwZw.jpg	1016
7	Linda@student.42.fr	Linda	2022-10-11 14:21:02.101	1	https://images.generated.photos/rmr4FYnGM61os8g3p0yi0tueVEwHI5KLBQLAtUiVwSk/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/NTc2NDMxLmpwZw.jpg	984
22	Daniel@student.42.fr	Daniel	2022-10-11 14:21:10.657	1	https://images.generated.photos/j87BH0t2lIibcIAX4IGPigNrPiROLNL9c-qNFxXiS0U/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/NzQ3NTI0LmpwZw.jpg	1000
34	Paul@student.42.fr	Paul	2022-10-11 14:21:15.756	1	https://images.generated.photos/yIYoV_LTz1w8Ld8e6l59F3K70PtYqXAszMgMgECGzwc/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/Mzk5OTcyLmpwZw.jpg	1000
11	Barbara@student.42.fr	Barbara	2022-10-11 14:21:17.125	1	https://images.generated.photos/4glcx_BvO5XDwGK5bwmM2eDxxStyA-Mz3r9IV75VoI8/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MjI4MjAzLmpwZw.jpg	1000
5	Jennifer@student.42.fr	Jennifer	2022-10-11 14:21:17.455	1	https://images.generated.photos/tDDoGCz7bdNU8nNkFrRaFWQqw2AO_U1p1KlPrSqWcHg/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MDY3MTUwLmpwZw.jpg	1000
20	Christopher@student.42.fr	Christopher	2022-10-11 14:21:21.365	1	https://images.generated.photos/pP-CjiXkGga3CuZyZvMOJMv8_CXEpEuI-kTRI8_D9z4/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MDUyNTU4LmpwZw.jpg	1000
32	Steven@student.42.fr	Steven	2022-10-11 14:21:26.138	1	https://images.generated.photos/T4wPyQAlF2Nx9z5PdivPQdy-l07K5P3VqvupUOldo00/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/NzI4MDMzLmpwZw.jpg	1000
39	Michelle@student.42.fr	Michelle	2022-10-11 14:21:52.036	1	https://images.generated.photos/YKTIKMs38ninfTzLNl1X36aAVHYPnCALGaKWJI21cRM/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/NzkwMzI4LmpwZw.jpg	1000
8	David@student.42.fr	David	2022-10-11 14:21:43.337	1	https://images.generated.photos/y0Hbw-Twd6UygmOUDF4szwvVRO3RTcRLHtOEYSmfNg8/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MjU2MzM1LmpwZw.jpg	1016
6	Michael@student.42.fr	Michael	2022-10-11 14:19:48.877	1	https://images.generated.photos/Qiye9e8RHsCvfyv22MNJwMzDGBhk1B60k6nGUJBDmjM/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MjcxNDcxLmpwZw.jpg	1060
33	Kimberly@student.42.fr	Kimberly	2022-10-11 14:20:52.728	1	https://images.generated.photos/8L6JADXXyDdidv5wjKgMhHlRCjFBGBe1eDEDO0U25Ag/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MDc3MDE5LmpwZw.jpg	946
\.


--
-- Data for Name: UserAchievement; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public."UserAchievement" ("achievementId", date, "userId") FROM stdin;
\.


--
-- Data for Name: UserOnChannel; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public."UserOnChannel" ("channelId", "userId", mode) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: transcendence
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
5fe32bad-a740-45d9-929d-912989aa8696	61768f1ee045e16d972f39b675934653f555c228e71cb100a1995aba070e92f8	2022-10-11 14:16:02.566696+00	20220818160459_	\N	\N	2022-10-11 14:16:00.385309+00	1
034ac12c-0303-4566-abca-1bd843e43b03	490183f29a4b3202cefb25a2cc95b1fef5db3e5d3458730d34f8ee7086a5ab34	2022-10-11 14:16:12.037371+00	20220829162558_renaming_current_ladder	\N	\N	2022-10-11 14:16:11.829289+00	1
e6a2d7d5-f64b-45e4-bc30-7aaadf21c000	a3bd7ed9198faa1f51bd2792ddb88b1153076ef76b1b3ad695e15bfe5f1f84f8	2022-10-11 14:16:06.802903+00	20220822143211_first_complete_schema	\N	\N	2022-10-11 14:16:02.625537+00	1
6361fac7-b372-4ea9-92bf-feee940008b4	ea34fa85e9399b32eb5a8a94d8dd253f1d05533fa2fa6e390162fef2ed708c2f	2022-10-11 14:16:07.169711+00	20220823154942_added_cascade_on_delete_user	\N	\N	2022-10-11 14:16:06.8865+00	1
05035324-322f-4672-8f8c-19e5e47790f0	9aba9bf94ebe8288e6913462684106b797e265c9c18c45369d2de431dc7d38f7	2022-10-11 14:16:15.037052+00	20220910074815_	\N	\N	2022-10-11 14:16:14.805016+00	1
2999b42a-0fdc-46a0-88c3-6beb2ba45703	41b4e03a15fa1346a2f150b822e98cef9d5d19d8a0c76705439f3daacbd3f110	2022-10-11 14:16:07.629037+00	20220823155140_fix_previous_mistake	\N	\N	2022-10-11 14:16:07.287707+00	1
7ae9593f-537e-4762-96ea-bd1823ccdc13	72e4f669aafacd12f1c8410c125a60e7d041919ef01ee58714f12fc7130dcc2a	2022-10-11 14:16:12.303926+00	20220829162731_updating_defaut_current_status	\N	\N	2022-10-11 14:16:12.120965+00	1
cdb822f9-11b0-47ab-88eb-336a546134f1	b1e6d53c2c65eafc2215053476367949effe4d6392dd227b19d20a74756bcfb9	2022-10-11 14:16:08.228215+00	20220824094033_changing_friendship_relation	\N	\N	2022-10-11 14:16:07.695464+00	1
8ba077f7-2399-4c1e-8086-59c11c836048	aabdf0be4efaa9fbd0c8f5f16bd9154fb082370e35a0ff80bf97085e616d4872	2022-10-11 14:16:09.337073+00	20220826092857_adding_2fa_and_updating_achievement	\N	\N	2022-10-11 14:16:08.336911+00	1
559e6e27-8a9c-46a5-9677-9a53958e998f	6c665ebc8186a083b69593db683d97962c6d9610521c6a895a4cef962ceed734	2022-10-11 14:16:09.66209+00	20220826103150_	\N	\N	2022-10-11 14:16:09.412442+00	1
02859256-091e-49e7-9154-9536c48d2911	5de02f64d051616d0835b86313fad8d0b7e4cf4a51cfb4a47917d596d0574c32	2022-10-11 14:16:12.637177+00	20220829163227_updating_defaut_match_status	\N	\N	2022-10-11 14:16:12.37931+00	1
22bd92b0-5289-4078-8658-f33f1f22ccaf	fc60378ebeee476dac768b35e23b1e77dd8ce9abc28672d171faffcacf6fbbe5	2022-10-11 14:16:09.995292+00	20220826105618_	\N	\N	2022-10-11 14:16:09.745721+00	1
7db04fdd-c01b-4c9d-add9-185178ba0bd0	b6ba361a65595272e929dadb40382742b7a83a3249d7131da26d69d646ed5ae3	2022-10-11 14:16:10.537093+00	20220826162153_user_friendship_to_friendship	\N	\N	2022-10-11 14:16:10.087284+00	1
ad6d0502-b4f2-432d-921e-41b8f900848e	d1591ced20812fea24c2579e429ff28a0a32dbd345c5ac7e1f608961100af61e	2022-10-11 14:16:10.787184+00	20220827134504_	\N	\N	2022-10-11 14:16:10.604261+00	1
c57e951a-329f-4132-b661-ea6be95ea449	ab8fe9f44ccd368bb2f81e61047be5868dfe7a51a567670b8317f4c2e6848e60	2022-10-11 14:16:13.362512+00	20220830105140_replacing_rank_with_rating	\N	\N	2022-10-11 14:16:12.720872+00	1
e80f3a46-2bb8-4678-bd26-bbac07028367	7ce1b83763886480f14256aee14be5d15b0f3634f767c29e691031810e48af97	2022-10-11 14:16:11.087166+00	20220828095950_	\N	\N	2022-10-11 14:16:10.862538+00	1
3bfe27a6-7835-4c48-a254-4884112e7168	cf67f5270761ced53fa25c9e8f60f6a07841ddc237d2caeb640af777713fc17d	2022-10-11 14:16:11.445516+00	20220829125333_win_probability_on_players	\N	\N	2022-10-11 14:16:11.154217+00	1
974eba61-1eaf-44cf-a92d-42f9b27e2879	41020e4ed4aea7e72036149f24c0925a698b4407ac9a190c57808d2d4e307e5f	2022-10-11 14:16:11.762215+00	20220829150217_default_user_status_1	\N	\N	2022-10-11 14:16:11.529222+00	1
7ae73800-5ca7-4958-9aca-fcdfc3b61c84	e8f6bf33fe4fe39614a6728a0f25b7468076f7264eeb4de083b2370928f5fb2d	2022-10-11 14:16:13.737433+00	20220830134617_fixing_unique_contraints	\N	\N	2022-10-11 14:16:13.454518+00	1
503c0810-b2d0-4b86-a481-81a7e5bda5f4	d95f6c19aad293a2bc5aa224020ec137f6a2d2e56c1daf8e531b2b36ca8a4a9b	2022-10-11 14:16:14.062805+00	20220831080803_fk_constraints_update	\N	\N	2022-10-11 14:16:13.821094+00	1
3090c929-7351-4b44-b42e-772488b7c73f	bbaf139c703093eee860f5cc2b35cd8a221dee6cb554aed3593048f14dbb462a	2022-10-11 14:16:14.337725+00	20220909153655_updating_players_on_match_sides	\N	\N	2022-10-11 14:16:14.130004+00	1
f0d57760-a250-4aa8-8668-5f5386845905	6a46d9cb192c1190da0962f9549272486a1ff6610389deee6aacda864caf8e15	2022-10-11 14:16:14.729613+00	20220909154704_simplifying_attribute_names	\N	\N	2022-10-11 14:16:14.379887+00	1
\.


--
-- Name: Achievement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: transcendence
--

SELECT pg_catalog.setval('public."Achievement_id_seq"', 1, false);


--
-- Name: Channel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: transcendence
--

SELECT pg_catalog.setval('public."Channel_id_seq"', 1, false);


--
-- Name: Credentials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: transcendence
--

SELECT pg_catalog.setval('public."Credentials_id_seq"', 1, false);


--
-- Name: Match_id_seq; Type: SEQUENCE SET; Schema: public; Owner: transcendence
--

SELECT pg_catalog.setval('public."Match_id_seq"', 28, true);


--
-- Name: Rating_id_seq; Type: SEQUENCE SET; Schema: public; Owner: transcendence
--

SELECT pg_catalog.setval('public."Rating_id_seq"', 68, true);


--
-- Name: Stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: transcendence
--

SELECT pg_catalog.setval('public."Stats_id_seq"', 40, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: transcendence
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, false);


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
-- Name: Channel_name_key; Type: INDEX; Schema: public; Owner: transcendence
--

CREATE UNIQUE INDEX "Channel_name_key" ON public."Channel" USING btree (name);


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
-- Adjusting auto increment
--
ALTER SEQUENCE User_id_seq RESTART WITH 100;
ALTER SEQUENCE Achievement_id_seq RESTART WITH 100;
ALTER SEQUENCE Channel_id_seq RESTART WITH 100;
ALTER SEQUENCE Credentials_id_seq RESTART WITH 100;
ALTER SEQUENCE Match_id_seq RESTART WITH 200;
ALTER SEQUENCE Rating_id_seq RESTART WITH 200;
ALTER SEQUENCE Stats_id_seq RESTART WITH 200;

--
-- PostgreSQL database dump complete
--

