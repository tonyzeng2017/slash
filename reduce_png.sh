
/Applications/CocosCreator.app/Contents/MacOS/CocosCreator --path ./  --build "platform=android"

#!/bin/bash
function ergodic(){  
        for file in ` ls $1 `  
        do  
                if [ -d $1"/"$file ]  
                then  
                        ergodic $1"/"$file  
                else
                	filename=$1"/"$file
                	extension="${filename##*.}"
                	#echo $extension
                	if [ "$extension"x = "pngx" ]; then     
                	      ~/tools/pngquant/pngquant --quality=65-80 $filename -f
                              echo $filename
                	fi
                fi  
        done 
}

INIT_PATH1="./build/jsb-link/res/raw-assets"
INIT_PATH2="./build/jsb-link/res/raw-internal"

ergodic $INIT_PATH1
ergodic $INIT_PATH2

/Applications/CocosCreator.app/Contents/MacOS/CocosCreator --path ./  --compile "platform=android"
