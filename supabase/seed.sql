-- ============================================================
-- SPORTS
-- ============================================================
insert into public.sports (id, name) values
  ('NFL', 'National Football League'),
  ('MLB', 'Major League Baseball'),
  ('NBA', 'National Basketball Association'),
  ('NHL', 'National Hockey League'),
  ('MLS', 'Major League Soccer');

-- ============================================================
-- TEAMS
-- ============================================================
insert into public.teams (id, sport_id, name, city, abbreviation, primary_color, slug) values
  -- NFL (32)
  ('nfl-ari', 'NFL', 'Cardinals', 'Arizona', 'ARI', '#97233A', 'arizona-cardinals'),
  ('nfl-atl', 'NFL', 'Falcons', 'Atlanta', 'ATL', '#A71930', 'atlanta-falcons'),
  ('nfl-bal', 'NFL', 'Ravens', 'Baltimore', 'BAL', '#241773', 'baltimore-ravens'),
  ('nfl-buf', 'NFL', 'Bills', 'Buffalo', 'BUF', '#00338D', 'buffalo-bills'),
  ('nfl-car', 'NFL', 'Panthers', 'Carolina', 'CAR', '#0085CA', 'carolina-panthers'),
  ('nfl-chi', 'NFL', 'Bears', 'Chicago', 'CHI', '#0B162A', 'chicago-bears'),
  ('nfl-cin', 'NFL', 'Bengals', 'Cincinnati', 'CIN', '#FB4F14', 'cincinnati-bengals'),
  ('nfl-cle', 'NFL', 'Browns', 'Cleveland', 'CLE', '#311D00', 'cleveland-browns'),
  ('nfl-dal', 'NFL', 'Cowboys', 'Dallas', 'DAL', '#003594', 'dallas-cowboys'),
  ('nfl-den', 'NFL', 'Broncos', 'Denver', 'DEN', '#FB4F14', 'denver-broncos'),
  ('nfl-det', 'NFL', 'Lions', 'Detroit', 'DET', '#0076B6', 'detroit-lions'),
  ('nfl-gb', 'NFL', 'Packers', 'Green Bay', 'GB', '#203731', 'green-bay-packers'),
  ('nfl-hou', 'NFL', 'Texans', 'Houston', 'HOU', '#03202F', 'houston-texans'),
  ('nfl-ind', 'NFL', 'Colts', 'Indianapolis', 'IND', '#002C5F', 'indianapolis-colts'),
  ('nfl-jax', 'NFL', 'Jaguars', 'Jacksonville', 'JAX', '#101820', 'jacksonville-jaguars'),
  ('nfl-kc', 'NFL', 'Chiefs', 'Kansas City', 'KC', '#E31837', 'kansas-city-chiefs'),
  ('nfl-lv', 'NFL', 'Raiders', 'Las Vegas', 'LV', '#000000', 'las-vegas-raiders'),
  ('nfl-lac', 'NFL', 'Chargers', 'Los Angeles', 'LAC', '#0080C6', 'los-angeles-chargers'),
  ('nfl-lar', 'NFL', 'Rams', 'Los Angeles', 'LAR', '#003594', 'los-angeles-rams'),
  ('nfl-mia', 'NFL', 'Dolphins', 'Miami', 'MIA', '#008E97', 'miami-dolphins'),
  ('nfl-min', 'NFL', 'Vikings', 'Minnesota', 'MIN', '#4F2683', 'minnesota-vikings'),
  ('nfl-ne', 'NFL', 'Patriots', 'New England', 'NE', '#002244', 'new-england-patriots'),
  ('nfl-no', 'NFL', 'Saints', 'New Orleans', 'NO', '#D3BC8D', 'new-orleans-saints'),
  ('nfl-nyg', 'NFL', 'Giants', 'New York', 'NYG', '#0B2265', 'new-york-giants'),
  ('nfl-nyj', 'NFL', 'Jets', 'New York', 'NYJ', '#125740', 'new-york-jets'),
  ('nfl-phi', 'NFL', 'Eagles', 'Philadelphia', 'PHI', '#004C54', 'philadelphia-eagles'),
  ('nfl-pit', 'NFL', 'Steelers', 'Pittsburgh', 'PIT', '#FFB612', 'pittsburgh-steelers'),
  ('nfl-sf', 'NFL', '49ers', 'San Francisco', 'SF', '#AA0000', 'san-francisco-49ers'),
  ('nfl-sea', 'NFL', 'Seahawks', 'Seattle', 'SEA', '#002244', 'seattle-seahawks'),
  ('nfl-tb', 'NFL', 'Buccaneers', 'Tampa Bay', 'TB', '#D50A0A', 'tampa-bay-buccaneers'),
  ('nfl-ten', 'NFL', 'Titans', 'Tennessee', 'TEN', '#0C2340', 'tennessee-titans'),
  ('nfl-was', 'NFL', 'Commanders', 'Washington', 'WAS', '#5A1414', 'washington-commanders'),
  -- MLB (30)
  ('mlb-ari', 'MLB', 'Diamondbacks', 'Arizona', 'ARI', '#A71930', 'arizona-diamondbacks'),
  ('mlb-atl', 'MLB', 'Braves', 'Atlanta', 'ATL', '#CE1141', 'atlanta-braves'),
  ('mlb-bal', 'MLB', 'Orioles', 'Baltimore', 'BAL', '#DF4601', 'baltimore-orioles'),
  ('mlb-bos', 'MLB', 'Red Sox', 'Boston', 'BOS', '#BD3039', 'boston-red-sox'),
  ('mlb-chc', 'MLB', 'Cubs', 'Chicago', 'CHC', '#0E3386', 'chicago-cubs'),
  ('mlb-cws', 'MLB', 'White Sox', 'Chicago', 'CWS', '#27251F', 'chicago-white-sox'),
  ('mlb-cin', 'MLB', 'Reds', 'Cincinnati', 'CIN', '#C6011F', 'cincinnati-reds'),
  ('mlb-cle', 'MLB', 'Guardians', 'Cleveland', 'CLE', '#00385D', 'cleveland-guardians'),
  ('mlb-col', 'MLB', 'Rockies', 'Colorado', 'COL', '#33006F', 'colorado-rockies'),
  ('mlb-det', 'MLB', 'Tigers', 'Detroit', 'DET', '#0C2340', 'detroit-tigers'),
  ('mlb-hou', 'MLB', 'Astros', 'Houston', 'HOU', '#002D62', 'houston-astros'),
  ('mlb-kc', 'MLB', 'Royals', 'Kansas City', 'KC', '#004687', 'kansas-city-royals'),
  ('mlb-laa', 'MLB', 'Angels', 'Los Angeles', 'LAA', '#BA0021', 'los-angeles-angels'),
  ('mlb-lad', 'MLB', 'Dodgers', 'Los Angeles', 'LAD', '#005A9C', 'los-angeles-dodgers'),
  ('mlb-mia', 'MLB', 'Marlins', 'Miami', 'MIA', '#00A3E0', 'miami-marlins'),
  ('mlb-mil', 'MLB', 'Brewers', 'Milwaukee', 'MIL', '#12284B', 'milwaukee-brewers'),
  ('mlb-min', 'MLB', 'Twins', 'Minnesota', 'MIN', '#002B5C', 'minnesota-twins'),
  ('mlb-nym', 'MLB', 'Mets', 'New York', 'NYM', '#002D72', 'new-york-mets'),
  ('mlb-nyy', 'MLB', 'Yankees', 'New York', 'NYY', '#003087', 'new-york-yankees'),
  ('mlb-oak', 'MLB', 'Athletics', 'Oakland', 'OAK', '#003831', 'oakland-athletics'),
  ('mlb-phi', 'MLB', 'Phillies', 'Philadelphia', 'PHI', '#E81828', 'philadelphia-phillies'),
  ('mlb-pit', 'MLB', 'Pirates', 'Pittsburgh', 'PIT', '#27251F', 'pittsburgh-pirates'),
  ('mlb-stl', 'MLB', 'Cardinals', 'St. Louis', 'STL', '#C41E3A', 'st-louis-cardinals'),
  ('mlb-sd', 'MLB', 'Padres', 'San Diego', 'SD', '#2F241D', 'san-diego-padres'),
  ('mlb-sf', 'MLB', 'Giants', 'San Francisco', 'SF', '#FD5A1E', 'san-francisco-giants'),
  ('mlb-sea', 'MLB', 'Mariners', 'Seattle', 'SEA', '#0C2C56', 'seattle-mariners'),
  ('mlb-tb', 'MLB', 'Rays', 'Tampa Bay', 'TB', '#092C5C', 'tampa-bay-rays'),
  ('mlb-tex', 'MLB', 'Rangers', 'Texas', 'TEX', '#003278', 'texas-rangers'),
  ('mlb-tor', 'MLB', 'Blue Jays', 'Toronto', 'TOR', '#134A8E', 'toronto-blue-jays'),
  ('mlb-was', 'MLB', 'Nationals', 'Washington', 'WAS', '#AB0003', 'washington-nationals'),
  -- NBA (30)
  ('nba-atl', 'NBA', 'Hawks', 'Atlanta', 'ATL', '#E03A3E', 'atlanta-hawks'),
  ('nba-bos', 'NBA', 'Celtics', 'Boston', 'BOS', '#007A33', 'boston-celtics'),
  ('nba-bkn', 'NBA', 'Nets', 'Brooklyn', 'BKN', '#000000', 'brooklyn-nets'),
  ('nba-cha', 'NBA', 'Hornets', 'Charlotte', 'CHA', '#1D1160', 'charlotte-hornets'),
  ('nba-chi', 'NBA', 'Bulls', 'Chicago', 'CHI', '#CE1141', 'chicago-bulls'),
  ('nba-cle', 'NBA', 'Cavaliers', 'Cleveland', 'CLE', '#860038', 'cleveland-cavaliers'),
  ('nba-dal', 'NBA', 'Mavericks', 'Dallas', 'DAL', '#00538C', 'dallas-mavericks'),
  ('nba-den', 'NBA', 'Nuggets', 'Denver', 'DEN', '#0E2240', 'denver-nuggets'),
  ('nba-det', 'NBA', 'Pistons', 'Detroit', 'DET', '#C8102E', 'detroit-pistons'),
  ('nba-gsw', 'NBA', 'Warriors', 'Golden State', 'GSW', '#1D428A', 'golden-state-warriors'),
  ('nba-hou', 'NBA', 'Rockets', 'Houston', 'HOU', '#CE1141', 'houston-rockets'),
  ('nba-ind', 'NBA', 'Pacers', 'Indiana', 'IND', '#002D62', 'indiana-pacers'),
  ('nba-lac', 'NBA', 'Clippers', 'LA', 'LAC', '#C8102E', 'la-clippers'),
  ('nba-lal', 'NBA', 'Lakers', 'Los Angeles', 'LAL', '#552583', 'los-angeles-lakers'),
  ('nba-mem', 'NBA', 'Grizzlies', 'Memphis', 'MEM', '#5D76A9', 'memphis-grizzlies'),
  ('nba-mia', 'NBA', 'Heat', 'Miami', 'MIA', '#98002E', 'miami-heat'),
  ('nba-mil', 'NBA', 'Bucks', 'Milwaukee', 'MIL', '#00471B', 'milwaukee-bucks'),
  ('nba-min', 'NBA', 'Timberwolves', 'Minnesota', 'MIN', '#0C2340', 'minnesota-timberwolves'),
  ('nba-nop', 'NBA', 'Pelicans', 'New Orleans', 'NOP', '#0C2340', 'new-orleans-pelicans'),
  ('nba-nyk', 'NBA', 'Knicks', 'New York', 'NYK', '#006BB6', 'new-york-knicks'),
  ('nba-okc', 'NBA', 'Thunder', 'Oklahoma City', 'OKC', '#007AC1', 'oklahoma-city-thunder'),
  ('nba-orl', 'NBA', 'Magic', 'Orlando', 'ORL', '#0077C0', 'orlando-magic'),
  ('nba-phi', 'NBA', '76ers', 'Philadelphia', 'PHI', '#006BB6', 'philadelphia-76ers'),
  ('nba-phx', 'NBA', 'Suns', 'Phoenix', 'PHX', '#1D1160', 'phoenix-suns'),
  ('nba-por', 'NBA', 'Trail Blazers', 'Portland', 'POR', '#E03A3E', 'portland-trail-blazers'),
  ('nba-sac', 'NBA', 'Kings', 'Sacramento', 'SAC', '#5A2D81', 'sacramento-kings'),
  ('nba-sas', 'NBA', 'Spurs', 'San Antonio', 'SAS', '#C4CED4', 'san-antonio-spurs'),
  ('nba-tor', 'NBA', 'Raptors', 'Toronto', 'TOR', '#CE1141', 'toronto-raptors'),
  ('nba-uta', 'NBA', 'Jazz', 'Utah', 'UTA', '#002B5C', 'utah-jazz'),
  ('nba-was', 'NBA', 'Wizards', 'Washington', 'WAS', '#002B5C', 'washington-wizards'),
  -- NHL (32)
  ('nhl-ana', 'NHL', 'Ducks', 'Anaheim', 'ANA', '#FC4C02', 'anaheim-ducks'),
  ('nhl-bos', 'NHL', 'Bruins', 'Boston', 'BOS', '#FFB81C', 'boston-bruins'),
  ('nhl-buf', 'NHL', 'Sabres', 'Buffalo', 'BUF', '#003087', 'buffalo-sabres'),
  ('nhl-cgy', 'NHL', 'Flames', 'Calgary', 'CGY', '#C8102E', 'calgary-flames'),
  ('nhl-car', 'NHL', 'Hurricanes', 'Carolina', 'CAR', '#CC0000', 'carolina-hurricanes'),
  ('nhl-chi', 'NHL', 'Blackhawks', 'Chicago', 'CHI', '#CF0A2C', 'chicago-blackhawks'),
  ('nhl-col', 'NHL', 'Avalanche', 'Colorado', 'COL', '#6F263D', 'colorado-avalanche'),
  ('nhl-cbj', 'NHL', 'Blue Jackets', 'Columbus', 'CBJ', '#002654', 'columbus-blue-jackets'),
  ('nhl-dal', 'NHL', 'Stars', 'Dallas', 'DAL', '#006847', 'dallas-stars'),
  ('nhl-det', 'NHL', 'Red Wings', 'Detroit', 'DET', '#CE1126', 'detroit-red-wings'),
  ('nhl-edm', 'NHL', 'Oilers', 'Edmonton', 'EDM', '#FF4C00', 'edmonton-oilers'),
  ('nhl-fla', 'NHL', 'Panthers', 'Florida', 'FLA', '#041E42', 'florida-panthers'),
  ('nhl-lak', 'NHL', 'Kings', 'Los Angeles', 'LAK', '#111111', 'los-angeles-kings'),
  ('nhl-min', 'NHL', 'Wild', 'Minnesota', 'MIN', '#154734', 'minnesota-wild'),
  ('nhl-mtl', 'NHL', 'Canadiens', 'Montréal', 'MTL', '#AF1E2D', 'montreal-canadiens'),
  ('nhl-nsh', 'NHL', 'Predators', 'Nashville', 'NSH', '#FFB81C', 'nashville-predators'),
  ('nhl-njd', 'NHL', 'Devils', 'New Jersey', 'NJD', '#CE1126', 'new-jersey-devils'),
  ('nhl-nyi', 'NHL', 'Islanders', 'New York', 'NYI', '#00539B', 'new-york-islanders'),
  ('nhl-nyr', 'NHL', 'Rangers', 'New York', 'NYR', '#0038A8', 'new-york-rangers'),
  ('nhl-ott', 'NHL', 'Senators', 'Ottawa', 'OTT', '#C2912C', 'ottawa-senators'),
  ('nhl-phi', 'NHL', 'Flyers', 'Philadelphia', 'PHI', '#F74902', 'philadelphia-flyers'),
  ('nhl-pit', 'NHL', 'Penguins', 'Pittsburgh', 'PIT', '#FCB514', 'pittsburgh-penguins'),
  ('nhl-sjs', 'NHL', 'Sharks', 'San Jose', 'SJS', '#006D75', 'san-jose-sharks'),
  ('nhl-sea', 'NHL', 'Kraken', 'Seattle', 'SEA', '#355464', 'seattle-kraken'),
  ('nhl-stl', 'NHL', 'Blues', 'St. Louis', 'STL', '#002F87', 'st-louis-blues'),
  ('nhl-tbl', 'NHL', 'Lightning', 'Tampa Bay', 'TBL', '#002868', 'tampa-bay-lightning'),
  ('nhl-tor', 'NHL', 'Maple Leafs', 'Toronto', 'TOR', '#00205B', 'toronto-maple-leafs'),
  ('nhl-uta', 'NHL', 'Hockey Club', 'Utah', 'UTA', '#69B3E7', 'utah-hockey-club'),
  ('nhl-van', 'NHL', 'Canucks', 'Vancouver', 'VAN', '#00205B', 'vancouver-canucks'),
  ('nhl-vgk', 'NHL', 'Golden Knights', 'Vegas', 'VGK', '#B4975A', 'vegas-golden-knights'),
  ('nhl-wsh', 'NHL', 'Capitals', 'Washington', 'WSH', '#CF0A2C', 'washington-capitals'),
  ('nhl-wpg', 'NHL', 'Jets', 'Winnipeg', 'WPG', '#041E42', 'winnipeg-jets'),
  -- MLS (29)
  ('mls-atl', 'MLS', 'Atlanta United', 'Atlanta', 'ATL', '#80000A', 'atlanta-united'),
  ('mls-atx', 'MLS', 'Austin FC', 'Austin', 'ATX', '#00B140', 'austin-fc'),
  ('mls-clt', 'MLS', 'Charlotte FC', 'Charlotte', 'CLT', '#1A85C8', 'charlotte-fc'),
  ('mls-chi', 'MLS', 'Chicago Fire', 'Chicago', 'CHI', '#CC2229', 'chicago-fire'),
  ('mls-cin', 'MLS', 'FC Cincinnati', 'Cincinnati', 'CIN', '#F05323', 'fc-cincinnati'),
  ('mls-mtl', 'MLS', 'CF Montréal', 'Montréal', 'MTL', '#003087', 'cf-montreal'),
  ('mls-col', 'MLS', 'Colorado Rapids', 'Colorado', 'COL', '#960A2C', 'colorado-rapids'),
  ('mls-clb', 'MLS', 'Columbus Crew', 'Columbus', 'CLB', '#FFF200', 'columbus-crew'),
  ('mls-dc', 'MLS', 'D.C. United', 'Washington', 'DC', '#231F20', 'dc-united'),
  ('mls-dal', 'MLS', 'FC Dallas', 'Dallas', 'DAL', '#E81F3E', 'fc-dallas'),
  ('mls-hou', 'MLS', 'Houston Dynamo', 'Houston', 'HOU', '#F16621', 'houston-dynamo'),
  ('mls-mia', 'MLS', 'Inter Miami CF', 'Miami', 'MIA', '#F7B5CD', 'inter-miami'),
  ('mls-la', 'MLS', 'LA Galaxy', 'Los Angeles', 'LA', '#00245D', 'la-galaxy'),
  ('mls-lafc', 'MLS', 'LAFC', 'Los Angeles', 'LAFC', '#C39E6D', 'lafc'),
  ('mls-min', 'MLS', 'Minnesota United', 'Minnesota', 'MIN', '#8CD2F4', 'minnesota-united'),
  ('mls-nsh', 'MLS', 'Nashville SC', 'Nashville', 'NSH', '#ECE83A', 'nashville-sc'),
  ('mls-ne', 'MLS', 'New England Revolution', 'New England', 'NE', '#CE0E2D', 'new-england-revolution'),
  ('mls-nyc', 'MLS', 'New York City FC', 'New York', 'NYC', '#6CACE4', 'new-york-city-fc'),
  ('mls-nyrb', 'MLS', 'New York Red Bulls', 'New York', 'NYRB', '#ED1E36', 'new-york-red-bulls'),
  ('mls-orl', 'MLS', 'Orlando City', 'Orlando', 'ORL', '#612B9B', 'orlando-city'),
  ('mls-phi', 'MLS', 'Philadelphia Union', 'Philadelphia', 'PHI', '#071B2C', 'philadelphia-union'),
  ('mls-por', 'MLS', 'Portland Timbers', 'Portland', 'POR', '#004812', 'portland-timbers'),
  ('mls-rsl', 'MLS', 'Real Salt Lake', 'Salt Lake City', 'RSL', '#B30838', 'real-salt-lake'),
  ('mls-sj', 'MLS', 'San Jose Earthquakes', 'San Jose', 'SJ', '#0D4C92', 'san-jose-earthquakes'),
  ('mls-sea', 'MLS', 'Seattle Sounders', 'Seattle', 'SEA', '#5D9741', 'seattle-sounders'),
  ('mls-skc', 'MLS', 'Sporting Kansas City', 'Kansas City', 'SKC', '#002B5C', 'sporting-kc'),
  ('mls-stl', 'MLS', 'St. Louis City SC', 'St. Louis', 'STL', '#B31B1B', 'st-louis-city'),
  ('mls-tor', 'MLS', 'Toronto FC', 'Toronto', 'TOR', '#B81137', 'toronto-fc'),
  ('mls-van', 'MLS', 'Vancouver Whitecaps', 'Vancouver', 'VAN', '#00245E', 'vancouver-whitecaps');

-- ============================================================
-- VENUES
-- ============================================================
insert into public.venues (id, sport_id, name, slug, city, state, capacity) values
  -- NFL
  ('v-arrowhead', 'NFL', 'Arrowhead Stadium', 'arrowhead-stadium', 'Kansas City', 'MO', 76416),
  ('v-sofi', 'NFL', 'SoFi Stadium', 'sofi-stadium', 'Inglewood', 'CA', 70240),
  ('v-att', 'NFL', 'AT&T Stadium', 'att-stadium', 'Arlington', 'TX', 80000),
  ('v-metlife', 'NFL', 'MetLife Stadium', 'metlife-stadium', 'East Rutherford', 'NJ', 82500),
  ('v-lambeau', 'NFL', 'Lambeau Field', 'lambeau-field', 'Green Bay', 'WI', 81441),
  ('v-levis', 'NFL', 'Levi''s Stadium', 'levis-stadium', 'Santa Clara', 'CA', 68500),
  ('v-allegiant', 'NFL', 'Allegiant Stadium', 'allegiant-stadium', 'Las Vegas', 'NV', 65000),
  ('v-linc', 'NFL', 'Lincoln Financial Field', 'lincoln-financial-field', 'Philadelphia', 'PA', 69796),
  ('v-soldier', 'NFL', 'Soldier Field', 'soldier-field', 'Chicago', 'IL', 61500),
  ('v-gillette', 'NFL', 'Gillette Stadium', 'gillette-stadium', 'Foxborough', 'MA', 65878),
  ('v-mt-bank', 'NFL', 'M&T Bank Stadium', 'mt-bank-stadium', 'Baltimore', 'MD', 71008),
  ('v-acrisure', 'NFL', 'Acrisure Stadium', 'acrisure-stadium', 'Pittsburgh', 'PA', 68400),
  -- MLB
  ('v-fenway', 'MLB', 'Fenway Park', 'fenway-park', 'Boston', 'MA', 37755),
  ('v-wrigley', 'MLB', 'Wrigley Field', 'wrigley-field', 'Chicago', 'IL', 41649),
  ('v-yankee', 'MLB', 'Yankee Stadium', 'yankee-stadium', 'Bronx', 'NY', 54251),
  ('v-dodger', 'MLB', 'Dodger Stadium', 'dodger-stadium', 'Los Angeles', 'CA', 56000),
  ('v-citi', 'MLB', 'Citi Field', 'citi-field', 'Queens', 'NY', 41922),
  ('v-truist', 'MLB', 'Truist Park', 'truist-park', 'Cumberland', 'GA', 41084),
  ('v-oracle', 'MLB', 'Oracle Park', 'oracle-park', 'San Francisco', 'CA', 41915),
  ('v-camden', 'MLB', 'Camden Yards', 'camden-yards', 'Baltimore', 'MD', 45971),
  ('v-globe-life', 'MLB', 'Globe Life Field', 'globe-life-field', 'Arlington', 'TX', 40518),
  ('v-busch', 'MLB', 'Busch Stadium', 'busch-stadium', 'St. Louis', 'MO', 46861),
  ('v-pnc', 'MLB', 'PNC Park', 'pnc-park', 'Pittsburgh', 'PA', 38747),
  -- NBA
  ('v-msg', 'NBA', 'Madison Square Garden', 'madison-square-garden', 'New York', 'NY', 19812),
  ('v-td-garden', 'NBA', 'TD Garden', 'td-garden', 'Boston', 'MA', 19156),
  ('v-crypto', 'NBA', 'Crypto.com Arena', 'crypto-arena', 'Los Angeles', 'CA', 20000),
  ('v-united-center', 'NBA', 'United Center', 'united-center', 'Chicago', 'IL', 20917),
  ('v-chase', 'NBA', 'Chase Center', 'chase-center', 'San Francisco', 'CA', 18064),
  ('v-kaseya', 'NBA', 'Kaseya Center', 'kaseya-center', 'Miami', 'FL', 19600),
  ('v-ball-arena', 'NBA', 'Ball Arena', 'ball-arena', 'Denver', 'CO', 19520),
  ('v-fiserv', 'NBA', 'Fiserv Forum', 'fiserv-forum', 'Milwaukee', 'WI', 17341),
  ('v-state-farm-arena', 'NBA', 'State Farm Arena', 'state-farm-arena', 'Atlanta', 'GA', 16888),
  ('v-aac', 'NBA', 'American Airlines Center', 'american-airlines-center', 'Dallas', 'TX', 19200),
  -- NHL
  ('v-ppg-paints', 'NHL', 'PPG Paints Arena', 'ppg-paints-arena', 'Pittsburgh', 'PA', 18387),
  ('v-bell-centre', 'NHL', 'Bell Centre', 'bell-centre', 'Montreal', 'QC', 21302),
  ('v-scotiabank', 'NHL', 'Scotiabank Arena', 'scotiabank-arena', 'Toronto', 'ON', 18819),
  ('v-wells-fargo', 'NHL', 'Wells Fargo Center', 'wells-fargo-center', 'Philadelphia', 'PA', 19543),
  ('v-capital-one', 'NHL', 'Capital One Arena', 'capital-one-arena', 'Washington', 'DC', 18573),
  ('v-t-mobile', 'NHL', 'T-Mobile Arena', 't-mobile-arena', 'Las Vegas', 'NV', 17367),
  ('v-enterprise', 'NHL', 'Enterprise Center', 'enterprise-center', 'St. Louis', 'MO', 18096),
  -- MLS
  ('v-mb-stadium', 'MLS', 'Mercedes-Benz Stadium', 'mercedes-benz-stadium', 'Atlanta', 'GA', 71000),
  ('v-allianz', 'MLS', 'Allianz Field', 'allianz-field', 'St. Paul', 'MN', 19400),
  ('v-providence', 'MLS', 'Providence Park', 'providence-park', 'Portland', 'OR', 25218),
  ('v-lumen', 'MLS', 'Lumen Field', 'lumen-field', 'Seattle', 'WA', 69000),
  ('v-geodis', 'MLS', 'GEODIS Park', 'geodis-park', 'Nashville', 'TN', 30000),
  ('v-q2', 'MLS', 'Q2 Stadium', 'q2-stadium', 'Austin', 'TX', 20738);

-- ============================================================
-- GAMES  (run via: INSERT ... ON CONFLICT (id) DO UPDATE SET ...)
-- ============================================================
insert into public.games (id, home_team_id, away_team_id, venue_id, game_date, home_score, away_score) values

  -- ══════════════════════════════════════════════════════
  --  NFL  —  2023-24 season + playoffs
  -- ══════════════════════════════════════════════════════

  -- Arrowhead Stadium (Chiefs home)
  ('g-nfl-1',  'nfl-kc',  'nfl-buf', 'v-arrowhead', '2024-01-21', 27, 24),   -- AFC Divisional Playoff (OT)
  ('g-nfl-4',  'nfl-kc',  'nfl-ne',  'v-arrowhead', '2023-10-05', 27, 17),   -- Reg season
  ('g-nfl-12', 'nfl-kc',  'nfl-cin', 'v-arrowhead', '2023-12-31', 25, 17),   -- Reg season week 17
  ('g-nfl-kc-lac', 'nfl-kc', 'nfl-lac', 'v-arrowhead', '2023-11-20', 31, 17), -- Reg season
  ('g-nfl-kc-lv',  'nfl-kc', 'nfl-lv',  'v-arrowhead', '2023-12-25', 20, 14), -- Christmas Day

  -- Allegiant Stadium (Raiders home + Super Bowl LVIII site)
  ('g-nfl-9',     'nfl-lv', 'nfl-kc',  'v-allegiant', '2023-10-27', 20, 31),  -- Reg season, KC wins in LV
  ('g-nfl-sb58',  'nfl-kc', 'nfl-sf',  'v-allegiant', '2024-02-11', 25, 22),  -- Super Bowl LVIII (OT, KC wins)
  ('g-nfl-lv-ne', 'nfl-lv', 'nfl-ne',  'v-allegiant', '2023-10-15', 21, 17),  -- Reg season

  -- AT&T Stadium (Cowboys home)
  ('g-nfl-2',     'nfl-dal', 'nfl-phi', 'v-att', '2023-12-10', 33, 13),       -- Reg season, DAL dominates
  ('g-nfl-dal-wc','nfl-dal', 'nfl-gb',  'v-att', '2024-01-14', 32, 48),       -- Wild Card: Packers upset Cowboys
  ('g-nfl-dal-was','nfl-dal','nfl-was', 'v-att', '2023-10-22', 34,  6),       -- Reg season
  ('g-nfl-dal-lar','nfl-dal','nfl-lar', 'v-att', '2023-09-17', 20, 19),       -- Reg season

  -- MetLife Stadium (Giants & Jets home)
  ('g-nfl-14',    'nfl-nyj', 'nfl-buf', 'v-metlife', '2023-11-06', 32,  6),   -- MNF: Jets dominate Bills
  ('g-nfl-nyg-phi','nfl-nyg','nfl-phi', 'v-metlife', '2023-09-21', 13, 26),   -- Reg season, PHI wins
  ('g-nfl-nyj-ne','nfl-nyj', 'nfl-ne',  'v-metlife', '2023-12-17', 17,  3),   -- Reg season
  ('g-nfl-16',    'nfl-nyg', 'nfl-ne',  'v-metlife', '2023-11-26', 10,  6),   -- Reg season, low-scoring

  -- Lambeau Field (Packers home)
  ('g-nfl-7',     'nfl-gb',  'nfl-chi', 'v-lambeau', '2023-09-18', 38, 20),   -- Reg season, Jordan Love debut at home
  ('g-nfl-gb-det','nfl-gb',  'nfl-det', 'v-lambeau', '2023-11-23', 22, 29),   -- Reg season: Lions win at Lambeau
  ('g-nfl-gb-min','nfl-gb',  'nfl-min', 'v-lambeau', '2023-12-23', 33, 10),   -- Reg season

  -- Levi's Stadium (49ers home)
  ('g-nfl-3',      'nfl-sf', 'nfl-sea', 'v-levis', '2023-11-19', 31, 13),     -- Reg season
  ('g-nfl-sf-dal', 'nfl-sf', 'nfl-dal', 'v-levis', '2023-10-08', 42, 10),     -- Reg season: SF crushes DAL
  ('g-nfl-13',     'nfl-sf', 'nfl-gb',  'v-levis', '2024-01-20', 24, 21),     -- NFC Divisional Playoff
  ('g-nfl-nfc-champ','nfl-sf','nfl-det','v-levis', '2024-01-28', 34, 31),      -- NFC Championship: Lions heartbreak

  -- Lincoln Financial Field (Eagles home)
  ('g-nfl-5',     'nfl-phi', 'nfl-nyg', 'v-linc', '2023-10-22', 14, 12),     -- Reg season
  ('g-nfl-15',    'nfl-phi', 'nfl-dal', 'v-linc', '2023-11-05', 28, 23),     -- Reg season
  ('g-nfl-phi-sf','nfl-phi', 'nfl-sf',  'v-linc', '2023-12-03', 17, 21),     -- SF wins in Philly

  -- Soldier Field (Bears home)
  ('g-nfl-10',    'nfl-chi', 'nfl-min', 'v-soldier', '2024-01-07', 13, 23),   -- Week 18
  ('g-nfl-chi-det','nfl-chi','nfl-det', 'v-soldier', '2023-11-19', 13, 31),   -- Lions win in Chicago

  -- Gillette Stadium (Patriots home)
  ('g-nfl-8',     'nfl-ne', 'nfl-nyj', 'v-gillette', '2023-10-01', 15, 10),  -- Reg season
  ('g-nfl-ne-buf','nfl-ne', 'nfl-buf', 'v-gillette', '2023-12-17', 21, 27),  -- Reg season: BUF wins in NE

  -- M&T Bank Stadium (Ravens home)
  ('g-nfl-bal-pit','nfl-bal','nfl-pit', 'v-mt-bank', '2023-11-16', 34, 17),   -- TNF: BAL dominant
  ('g-nfl-bal-jax','nfl-bal','nfl-jax', 'v-mt-bank', '2024-01-20', 34, 10),   -- AFC Divisional: BAL routs JAX
  ('g-nfl-11',    'nfl-bal', 'nfl-kc',  'v-mt-bank', '2024-01-28', 10, 17),   -- AFC Championship: KC wins in Baltimore

  -- Acrisure Stadium (Steelers home)
  ('g-nfl-6',     'nfl-pit', 'nfl-bal', 'v-acrisure', '2023-11-02', 17, 20),  -- Reg season: BAL wins in PIT
  ('g-nfl-pit-cle','nfl-pit','nfl-cle', 'v-acrisure', '2023-11-19', 13, 10),  -- Reg season

  -- SoFi Stadium (Rams & Chargers home)
  ('g-nfl-lar-sf', 'nfl-lar','nfl-sf',  'v-sofi', '2023-10-19', 16, 24),      -- SF wins at SoFi
  ('g-nfl-lac-kc', 'nfl-lac','nfl-kc',  'v-sofi', '2023-11-20', 10, 31),      -- KC wins at SoFi

  -- ══════════════════════════════════════════════════════
  --  MLB  —  2023 & 2024 regular season + 2024 World Series
  -- ══════════════════════════════════════════════════════

  -- Yankee Stadium
  ('g-mlb-1',    'mlb-nyy','mlb-bos', 'v-yankee', '2024-05-17',  8,  4),      -- Reg season: NYY beats BOS
  ('g-mlb-12',   'mlb-nyy','mlb-bos', 'v-yankee', '2023-09-01',  5,  4),      -- Reg season: NYY edges BOS
  ('g-mlb-nyy-tor','mlb-nyy','mlb-tor','v-yankee', '2024-07-05',  6,  2),      -- 4th of July
  ('g-mlb-ws3',  'mlb-nyy','mlb-lad', 'v-yankee', '2024-10-28',  2,  4),      -- 2024 World Series Game 3 (LAD wins)
  ('g-mlb-ws4',  'mlb-nyy','mlb-lad', 'v-yankee', '2024-10-29', 11,  4),      -- 2024 World Series Game 4 (NYY wins – their only win)
  ('g-mlb-ws5',  'mlb-nyy','mlb-lad', 'v-yankee', '2024-10-30',  6,  7),      -- 2024 World Series Game 5 (LAD clinch)

  -- Fenway Park
  ('g-mlb-3',    'mlb-bos','mlb-nyy', 'v-fenway', '2024-07-12',  6,  5),      -- Reg season: BOS edges NYY
  ('g-mlb-15',   'mlb-bos','mlb-tor', 'v-fenway', '2023-06-18',  7,  6),      -- Reg season
  ('g-mlb-bos-nyy-jun','mlb-bos','mlb-nyy','v-fenway','2024-06-18', 7, 2),    -- Reg season: BOS big win

  -- Dodger Stadium
  ('g-mlb-4',    'mlb-lad','mlb-sf',  'v-dodger', '2024-06-02',  7,  3),      -- Reg season: LAD beats SF
  ('g-mlb-13',   'mlb-lad','mlb-sd',  'v-dodger', '2023-07-22',  6,  1),      -- Reg season
  ('g-mlb-ws1',  'mlb-lad','mlb-nyy', 'v-dodger', '2024-10-25',  6,  3),      -- 2024 WS Game 1 (Freeman walk-off grand slam)
  ('g-mlb-ws2',  'mlb-lad','mlb-nyy', 'v-dodger', '2024-10-26',  4,  2),      -- 2024 WS Game 2 (LAD leads series 2-0)

  -- Wrigley Field
  ('g-mlb-2',    'mlb-chc','mlb-stl', 'v-wrigley', '2024-06-08',  5,  3),     -- Reg season
  ('g-mlb-14',   'mlb-chc','mlb-mil', 'v-wrigley', '2023-08-14',  4,  3),     -- Reg season
  ('g-mlb-chc-nyy','mlb-chc','mlb-nyy','v-wrigley','2024-05-04',  4,  2),     -- Interleague

  -- Citi Field
  ('g-mlb-5',    'mlb-nym','mlb-phi', 'v-citi', '2024-07-26',  4,  7),        -- Reg season: PHI wins at Citi
  ('g-mlb-nym-atl','mlb-nym','mlb-atl','v-citi','2024-06-15',  5,  2),        -- Reg season
  ('g-mlb-subway','mlb-nym','mlb-nyy','v-citi', '2024-07-23',  3,  4),        -- Subway Series: NYY wins

  -- Truist Park
  ('g-mlb-6',    'mlb-atl','mlb-nym', 'v-truist', '2024-05-28',  9,  2),      -- Reg season: ATL dominates
  ('g-mlb-atl-phi','mlb-atl','mlb-phi','v-truist','2024-06-30',  5,  4),      -- Reg season

  -- Oracle Park
  ('g-mlb-7',    'mlb-sf','mlb-lad',  'v-oracle', '2024-06-07',  5,  6),      -- Reg season: LAD wins in SF
  ('g-mlb-sf-sd','mlb-sf', 'mlb-sd',  'v-oracle', '2023-09-05',  4,  3),      -- Reg season

  -- Camden Yards
  ('g-mlb-8',    'mlb-bal','mlb-nyy', 'v-camden', '2024-08-10',  3,  5),      -- Reg season: NYY wins at Camden
  ('g-mlb-bal-bos','mlb-bal','mlb-bos','v-camden','2024-06-14',  7,  2),      -- Reg season: BAL dominates

  -- Globe Life Field
  ('g-mlb-9',    'mlb-tex','mlb-hou', 'v-globe-life', '2024-05-04',  4,  3),  -- Lone Star Series
  ('g-mlb-tex-nyy','mlb-tex','mlb-nyy','v-globe-life','2023-07-04', 5,  2),   -- 4th of July interleague

  -- Busch Stadium
  ('g-mlb-10',   'mlb-stl','mlb-chc', 'v-busch', '2024-06-21',  7,  4),      -- Reg season
  ('g-mlb-stl-mil','mlb-stl','mlb-mil','v-busch','2024-05-11',  3,  5),       -- Brewers win at Busch

  -- PNC Park
  ('g-mlb-11',   'mlb-pit','mlb-cin', 'v-pnc', '2024-07-04',  5,  2),        -- 4th of July
  ('g-mlb-pit-chc','mlb-pit','mlb-chc','v-pnc','2023-08-19',  4,  6),        -- Cubs win at PNC

  -- ══════════════════════════════════════════════════════
  --  NBA  —  2023-24 regular season + 2024 Finals
  -- ══════════════════════════════════════════════════════

  -- Madison Square Garden (Knicks)
  ('g-nba-1',    'nba-nyk','nba-bos', 'v-msg', '2024-02-05', 110, 115),       -- Celtics win at MSG
  ('g-nba-11',   'nba-nyk','nba-phi', 'v-msg', '2023-11-05', 121, 115),       -- Knicks beat Sixers
  ('g-nba-nyk-mia','nba-nyk','nba-mia','v-msg','2024-03-10', 117, 113),       -- Knicks beat Heat
  ('g-nba-nyk-bkn','nba-nyk','nba-bkn','v-msg','2023-11-20', 120,  97),       -- Knicks beat Nets (rivalry)

  -- TD Garden (Celtics)
  ('g-nba-2',    'nba-bos','nba-mia', 'v-td-garden', '2024-01-28', 127, 112), -- Celtics over Heat
  ('g-nba-12',   'nba-bos','nba-nyk', 'v-td-garden', '2023-12-08', 132, 109), -- Celtics cruise past Knicks
  ('g-nba-f24-g1','nba-bos','nba-dal','v-td-garden', '2024-06-06', 107,  89), -- 2024 NBA Finals Game 1 (BOS wins)
  ('g-nba-f24-g2','nba-bos','nba-dal','v-td-garden', '2024-06-09', 105,  98), -- 2024 NBA Finals Game 2 (BOS leads 2-0)
  ('g-nba-f24-g5','nba-bos','nba-dal','v-td-garden', '2024-06-17', 106,  88), -- 2024 NBA Finals Game 5 (Celtics clinch)

  -- Crypto.com Arena (Lakers)
  ('g-nba-3',    'nba-lal','nba-gsw', 'v-crypto', '2024-02-22', 121, 128),    -- Warriors win at Crypto
  ('g-nba-lal-den','nba-lal','nba-den','v-crypto','2024-03-02', 127, 115),    -- Lakers over Nuggets

  -- United Center (Bulls)
  ('g-nba-4',    'nba-chi','nba-mil', 'v-united-center', '2024-01-15', 108, 115), -- Bucks win in Chicago
  ('g-nba-13',   'nba-chi','nba-nyk', 'v-united-center', '2023-10-28', 113, 119), -- Knicks win in Chicago

  -- Chase Center (Warriors)
  ('g-nba-5',    'nba-gsw','nba-lal', 'v-chase', '2024-03-09', 134, 123),     -- Warriors over Lakers
  ('g-nba-14',   'nba-gsw','nba-lac', 'v-chase', '2023-11-17', 127, 113),     -- Warriors over Clippers

  -- Kaseya Center (Heat)
  ('g-nba-6',    'nba-mia','nba-bos', 'v-kaseya', '2024-02-14', 110, 107),    -- Heat edge Celtics
  ('g-nba-15',   'nba-mia','nba-mil', 'v-kaseya', '2023-12-19', 101, 107),    -- Bucks win in Miami

  -- Ball Arena (Nuggets)
  ('g-nba-7',    'nba-den','nba-okc', 'v-ball-arena', '2024-03-20', 116, 110), -- Nuggets over Thunder

  -- Fiserv Forum (Bucks)
  ('g-nba-8',    'nba-mil','nba-chi', 'v-fiserv', '2024-01-22', 129, 118),    -- Bucks over Bulls

  -- State Farm Arena (Hawks)
  ('g-nba-9',    'nba-atl','nba-nyk', 'v-state-farm-arena', '2024-02-09', 119, 124), -- Knicks win in Atlanta

  -- American Airlines Center (Mavericks)
  ('g-nba-10',   'nba-dal','nba-lal', 'v-aac', '2024-02-26', 144, 122),       -- Mavs blow out Lakers
  ('g-nba-f24-g3','nba-dal','nba-bos','v-aac', '2024-06-12', 106,  99),       -- 2024 NBA Finals Game 3 (DAL's only win)
  ('g-nba-f24-g4','nba-dal','nba-bos','v-aac', '2024-06-14',  77, 107),       -- 2024 NBA Finals Game 4 (BOS rout)

  -- ══════════════════════════════════════════════════════
  --  NHL  —  2023-24 regular season
  -- ══════════════════════════════════════════════════════

  -- PPG Paints Arena (Penguins)
  ('g-nhl-1',  'nhl-pit','nhl-phi', 'v-ppg-paints', '2024-02-17', 5, 2),      -- PIT beats PHI
  ('g-nhl-12', 'nhl-pit','nhl-wsh', 'v-ppg-paints', '2023-12-14', 3, 2),      -- Penguins edge Caps
  ('g-nhl-pit-nyr','nhl-pit','nhl-nyr','v-ppg-paints','2024-01-06', 4, 3),    -- Penguins beat Rangers

  -- MSG (Rangers)
  ('g-nhl-2',  'nhl-nyr','nhl-nyi', 'v-msg', '2024-02-05', 3, 1),             -- Rangers beat Islanders (rivalry)
  ('g-nhl-13', 'nhl-nyr','nhl-bos', 'v-msg', '2023-10-26', 5, 3),             -- Rangers over Bruins
  ('g-nhl-nyr-pit','nhl-nyr','nhl-pit','v-msg','2024-03-19', 4, 1),           -- Rangers dominate Penguins

  -- TD Garden (Bruins)
  ('g-nhl-3',  'nhl-bos','nhl-tor', 'v-td-garden', '2024-01-18', 4, 2),       -- Bruins beat Maple Leafs
  ('g-nhl-11', 'nhl-bos','nhl-nyr', 'v-td-garden', '2023-11-22', 4, 3),       -- Bruins edge Rangers
  ('g-nhl-bos-fla','nhl-bos','nhl-fla','v-td-garden','2024-02-15', 3, 2),     -- Bruins over Panthers

  -- Bell Centre (Canadiens)
  ('g-nhl-4',  'nhl-mtl','nhl-tor', 'v-bell-centre', '2024-03-09', 2, 4),     -- TOR wins in Montreal
  ('g-nhl-mtl-bos','nhl-mtl','nhl-bos','v-bell-centre','2023-11-11', 3, 5),   -- Bruins win in Montreal

  -- Scotiabank Arena (Maple Leafs)
  ('g-nhl-5',  'nhl-tor','nhl-bos', 'v-scotiabank', '2024-02-12', 3, 5),      -- Bruins win in Toronto
  ('g-nhl-15', 'nhl-tor','nhl-mtl', 'v-scotiabank', '2023-12-02', 4, 1),      -- TOR over MTL (Battle of Ontario/Quebec)

  -- Wells Fargo Center (Flyers)
  ('g-nhl-6',  'nhl-phi','nhl-pit', 'v-wells-fargo', '2024-02-29', 3, 4),     -- Penguins win in Philly

  -- Capital One Arena (Capitals)
  ('g-nhl-7',  'nhl-wsh','nhl-pit', 'v-capital-one', '2024-01-25', 5, 3),     -- Caps beat Penguins
  ('g-nhl-wsh-nyr','nhl-wsh','nhl-nyr','v-capital-one','2024-02-08', 4, 2),   -- Caps beat Rangers

  -- T-Mobile Arena (Golden Knights)
  ('g-nhl-8',  'nhl-vgk','nhl-col', 'v-t-mobile', '2024-02-20', 4, 1),        -- VGK over Avalanche
  ('g-nhl-14', 'nhl-vgk','nhl-edm', 'v-t-mobile', '2023-11-28', 3, 2),        -- VGK over Oilers

  -- Enterprise Center (Blues)
  ('g-nhl-9',  'nhl-stl','nhl-chi', 'v-enterprise', '2024-03-02', 5, 2),      -- Blues over Blackhawks
  ('g-nhl-10', 'nhl-chi','nhl-stl', 'v-united-center', '2024-01-30', 2, 3),   -- Blues win in Chicago

  -- ══════════════════════════════════════════════════════
  --  MLS  —  2023 & 2024 seasons
  -- ══════════════════════════════════════════════════════

  -- Mercedes-Benz Stadium (Atlanta United)
  ('g-mls-1',  'mls-atl','mls-mia', 'v-mb-stadium', '2024-03-16', 3, 1),      -- ATL beats Inter Miami
  ('g-mls-7',  'mls-atl','mls-dc',  'v-mb-stadium', '2023-07-08', 4, 0),      -- ATL routs DC United
  ('g-mls-atl-por','mls-atl','mls-por','v-mb-stadium','2024-05-04', 2, 1),    -- ATL beats Portland

  -- Allianz Field (Minnesota United)
  ('g-mls-2',  'mls-min','mls-sea', 'v-allianz', '2024-04-06', 2, 0),         -- MNUFC beats Sounders
  ('g-mls-9',  'mls-min','mls-chi', 'v-allianz', '2023-08-26', 2, 1),         -- MNUFC beats Fire
  ('g-mls-min-rsl','mls-min','mls-rsl','v-allianz','2024-06-22', 3, 1),       -- MNUFC beats RSL

  -- Providence Park (Portland Timbers)
  ('g-mls-3',  'mls-por','mls-sea', 'v-providence', '2024-05-11', 1, 1),      -- Cascadia rivalry draw
  ('g-mls-11', 'mls-por','mls-la',  'v-providence', '2023-08-05', 2, 2),      -- POR draws with LA Galaxy
  ('g-mls-por-skc','mls-por','mls-skc','v-providence','2024-07-13', 2, 0),    -- POR beats Sporting KC

  -- Lumen Field (Seattle Sounders)
  ('g-mls-4',  'mls-sea','mls-la',  'v-lumen', '2024-05-25', 2, 0),           -- SEA beats LA Galaxy
  ('g-mls-8',  'mls-sea','mls-por', 'v-lumen', '2023-09-16', 3, 1),           -- SEA beats POR (Cascadia)
  ('g-mls-sea-van','mls-sea','mls-van','v-lumen','2024-06-08', 4, 0),         -- SEA dominates Vancouver

  -- GEODIS Park (Nashville SC)
  ('g-mls-5',  'mls-nsh','mls-atl', 'v-geodis', '2024-04-20', 3, 2),          -- NSH edges ATL
  ('g-mls-10', 'mls-nsh','mls-sea', 'v-geodis', '2023-10-07', 1, 0),          -- NSH beats SEA
  ('g-mls-nsh-cin','mls-nsh','mls-cin','v-geodis','2024-05-18', 2, 1),        -- NSH beats FC Cincinnati

  -- Q2 Stadium (Austin FC)
  ('g-mls-6',  'mls-atx','mls-dal', 'v-q2', '2024-06-01', 2, 1),              -- Austin beats FC Dallas
  ('g-mls-12', 'mls-atx','mls-hou', 'v-q2', '2023-06-17', 3, 0),              -- Austin beats Houston Dynamo
  ('g-mls-atx-skc','mls-atx','mls-skc','v-q2','2024-07-20', 1, 0)             -- Austin beats Sporting KC

on conflict (id) do update set
  home_team_id = excluded.home_team_id,
  away_team_id = excluded.away_team_id,
  venue_id     = excluded.venue_id,
  game_date    = excluded.game_date,
  home_score   = excluded.home_score,
  away_score   = excluded.away_score;
