# bechsmartly-ghost
bechsmartly website is implemented as a ghost theme

The bechsmartly website as well as blog runs as a [ghost](https://ghost.org/) theme. 
It has a very simple strcture, index.hbs has the home page, while blog is loaded with default-blog.hbs. Simply navigate to
`/blog`. If that does not work, consult ghost's documentation.

For a developer of this respository three things are worthwile to note:
* [Gulp](http://gulpjs.com/) is used for building the css, html and livereloading the dev server to view changes instantly
* [Flightplan](https://github.com/pstadler/flightplan) has been used for deployment, but 
that is not a restriction. One might as well use FTP
* If you run `gulp build` then you get a build.zip which has the latest GHOST theme. On production server 
replace the existing theme with this new zip(extracted) and restart ghost server
