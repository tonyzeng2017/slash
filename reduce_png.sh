
defaultSourceDir="./build/jsb-link/frameworks/runtime-src/proj.android-studio"

if [ -n "$1" ] ;then
    surfix="$1"
    sourceDir="./build/jsb-link/frameworks/runtime-src/proj.android-$surfix/"

    echo "removing the $defaultSourceDir......"
    rm -rf $defaultSourceDir

    echo "copy to the $defaultSourceDir......"
    cp -r $sourceDir $defaultSourceDir
else
    echo "use the default source dir~~~~~~~~"
fi

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
                	      ~/tools/pngquant/pngquant -f --quality=65-80 256 $filename -o $filename
                              echo $filename
                	fi
                fi
        done
}

INIT_PATH1="./build/jsb-link/res/raw-assets"
INIT_PATH2="./build/jsb-link/res/raw-internal"

#ergodic $INIT_PATH1
#ergodic $INIT_PATH2

/Applications/CocosCreator.app/Contents/MacOS/CocosCreator --path ./  --compile "platform=android"
