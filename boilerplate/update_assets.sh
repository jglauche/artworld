

data=$(find data/** -name *.png -o -name *.tmx -o -name *.fnt)


echo "const DataManifest = ["
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

  echo { src: \"./$line\",  name: \"$name\", type: \"$typ\" },;

done <<< "$data"

echo "]; export default DataManifest;"

