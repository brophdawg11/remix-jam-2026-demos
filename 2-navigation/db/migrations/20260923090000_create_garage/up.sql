create table cars (
  id text primary key,
  name text not null check (length(name) between 2 and 40),
  created_at integer not null,
  chassis_id text not null,
  engine_id text,
  paint_id text,
  tires_id text,
  spoiler_id text,
  hood_id text
);

insert into cars values
  (
    'midnight-special',
    'Midnight Special',
    unixepoch() * 1000 - 7200000,
    'chassis-apex',
    'engine-v8',
    'paint-apex-blue',
    'tires-track',
    'spoiler-ducktail',
    'hood-vented'
  ),
  (
    'weekend-sprint',
    'Weekend Sprint',
    unixepoch() * 1000 - 3600000,
    'chassis-sprint',
    'engine-i4',
    'paint-paddock-green',
    'tires-street',
    null,
    'hood-smooth'
  );
