#!/bin/bash

pdftoppm $1.pdf $1 -png

convert -resize 595x842 -quality 60 $1.png urkunde.png