find ./thumbnails -maxdepth 1 -type d -print0 | while read -d $'\0' folder
	do find "$folder"/*.png -maxdepth 1 -print0 | while read -d $'\0' file
		do convert "$file" -resize 'x32' "$file"
	done
done
