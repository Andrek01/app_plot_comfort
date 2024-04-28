#!/usr/bin/env python3
# Create_Series_item.py

#!!!!!!!!!!!!!!!!!!!! Important !!!!!!!!!!!!!!!
# Please change "smartvisu_pages" to your plugin-instance-name
# of the smartvisu-plugin
#!!!!!!!!!!!!!!!!!!!! Important !!!!!!!!!!!!!!!

svDir = sh.smartvisu_pages.smartvisu_dir + '/pages/'                # <- change here
svPage = sh.smartvisu_pages.read_from_sv_configini('pages')         # <- change here

from lib.item import Items
items = Items.get_instance()
myDbItems = []
myListItem = []
allItems = items.return_items()
for myItem in allItems:
    if hasattr(myItem,'db'):
       myDbItems.append(myItem.property.path)
    if (myItem.property.type == 'list'):
       myListItem.append(myItem.property.path)
myDbItems = sorted(myDbItems, key=lambda s: s.lower())

myListItem = sorted(myListItem, key=lambda s: s.lower())

RetVal = { "Series" : myDbItems,
           "ListItems" : myListItem
         }
myFile = svDir+svPage+'/series_items.json'
f = open(myFile, "w")
f.write(json.dumps(RetVal))
f.close()