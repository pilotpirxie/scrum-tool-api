CREATE TABLE "boards" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "code" varchar(64) NOT NULL,
  "stage" int NOT NULL,
  "timer_to" datetime NOT NULL,
  "created_at" datetime NOT NULL,
  "updated_at" datetime NOT NULL
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "sid" varchar(256) NOT NULL,
  "board_id" int NOT NULL,
  "is_ready" boolean NOT NULL,
  "nickname" varchar(64) NOT NULL,
  "avatar" int NOT NULL,
  "created_at" datetime NOT NULL,
  "updated_at" datetime NOT NULL
);

CREATE TABLE "cards" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "board_id" int NOT NULL,
  "content" varchar(512) NOT NULL,
  "stacked_on" int NOT NULL,
  "user_id" int NOT NULL,
  "column" int NOT NULL,
  "created_at" datetime NOT NULL,
  "updated_at" datetime NOT NULL
);

CREATE TABLE "votes" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "card_id" int NOT NULL,
  "user_id" int NOT NULL,
  "created_at" datetime NOT NULL,
  "updated_at" datetime NOT NULL
);

ALTER TABLE "boards" ADD FOREIGN KEY ("id") REFERENCES "users" ("board_id");

ALTER TABLE "cards" ADD FOREIGN KEY ("board_id") REFERENCES "boards" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("id") REFERENCES "cards" ("user_id");

ALTER TABLE "users" ADD FOREIGN KEY ("id") REFERENCES "votes" ("user_id");

ALTER TABLE "cards" ADD FOREIGN KEY ("id") REFERENCES "votes" ("card_id");
