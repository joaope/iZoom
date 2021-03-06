[![Build Status](https://travis-ci.org/joaope/iZoom.svg?branch=master)](https://travis-ci.org/joaope/iZoom)
[![Dependency Status](https://david-dm.org/joaope/izoom.svg)](https://david-dm.org/joaope/izoom)
[![devDependency Status](https://david-dm.org/joaope/izoom/dev-status.svg)](https://david-dm.org/joaope/izoom#info=devDependencies)
[![Analytics](https://ga-beacon.appspot.com/UA-55655362-1/joaope/izoom/readme.markdown)](https://github.com/joaope/izoom)

# iZoom #

Chrome extension that automatically changes zoom level to fit window width.


### Modes ###

The main objective is to have 3 different zoom modes:

* ***Shrink Only*** - Zoom is always at 100% unless window width is decreased and the contents are shrinked to fit, avoiding horizontal scrollbar (this is probably the expected behaviour for most of the users).
* ***Grow Only*** - Zoom level is never lower than 100% and it only grows for the contents to fit window width.
* ***Shrink and Grow*** - Contents are shrinked and growed to fit window width.


### Options ###

In addition to the zoom mode the user can choose which addresses he/she wants to exclude from being zoomed in/out. This options are available through options page and on each tab's context menu.
