# Media server (WIP)
A Plex-like media server.

## Media folder structure
Organize your media files to a following folder structure shown below. Relevant things for the scanner are: 
* The name of the folder should correspond the content of the folder, for example, movie "Batman (1989)"   
should be in folder "Batman (1989)"
* In case of tv-shows:
    * The season number should be found either from the file name in sXXeYY format, or in the folder and 
    * The episode number should be found either from the file name in sXXeYY format, or from the beginning or end of the file name

```
media/  # this folder can be named however you like
    movies/
        An awesome movie (2020)/
            An.Awesome.Movie.(2020).2160p.UHD.BluRay.HDR.x265.Atmos.TrueHD7.1-HDC.mkv
        Another good movie 2000/
            Another_good_movie_2000.mp4
        Not so good movie/
            NotSoGoodMovie.avi
        
    tv/
        Popular series/
            Season 1/
                Popular.series.S01E01.Episode.Name.1080p.WEBRip.HDR10.10Bit.DDP5.1.H265-d3g.mkv
                Popular.series.S01E02.Second.Episode.Name.1080p.WEBRip.HDR10.10Bit.DDP5.1.H265-d3g.mkv
                ...
            Season 2/
                 Popular.series.s02e01.1080p.WEBRip.HDR10.10Bit.DDP5.1.H265-d3g.mkv
                 ...
        Another series/
            Season 3/
                123 Episode name.flv
                124 Episode name.flv
        Kids' show
            Season 1/
                kids_show_01.mp4
                kids_show_04.mp4
```

## Requirements
Requires docker and node 16+

Add .env to server/ folder with the following information:  
PORT=\<backend port>  
PGPORT=\<postgres port>  
PGUSER=\<postgres user>  
PGNAME=\<database name>  
PGPASSWORD=\<password for user>  
TOKEN_KEY=\<jwt secret>  
TMDB_BEARER_TOKEN=\<bearer token for [themoviedb.org](themoviedb.org)>  
DATA_DIR=\<The location of your media files, eg. /data/media for the example above>

## Running
Run `npm install` in server folder
`docker compose up` to run the server inside a docker container
