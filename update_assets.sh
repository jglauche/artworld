#!/bin/bash

output="./src/manifest.js"
truncate --size 0 $output


create_manifest() {

  echo "export const $1 = [" >> $output
  data=$(find $2 -name \*.png -o -name \*.tmx -o -name \*.fnt -o -name \*.json)
  while read -r line ; do

    file=`basename "$line"`
    name=`echo "$file" | cut -d'.' -f1`
    ext=`echo "$file" | cut -d'.' -f2`

    case $ext in
      png)
        typ="image"
        ;;
      json)
        typ="json"
        ;;
      tmx)
        typ="tmx"
        ;;
      *)
        typ="binary"
        ;;
    esac

    echo "{ src: \"./$line\",  name: \"$name\", type: \"$typ\" }," >> $output

  done <<< "$data"

  echo "];" >> $output
}

create_manifest DataManifest "data/fnt/** data/tilesets/** data/map/**"
create_manifest Characters "data/characters_32px/**"
create_manifest Artworld "data/artworks/artworld/**"






