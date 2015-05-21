==================================================
header               css  #header
header-logo          css  #header .logo
header-caption       css  #header h1

menu                 css  #menu
menu-item-*          css  #menu li a

content              css  #content
side-panel           css  #side-panel
side-panel-caption   css  #side-panel h2
side-panel-links-*   css  #side-panel li a

article              css  #article
article-caption      css  #article h1
article-text         css  #article-text

comments             css  #comments

footer               css  #footer
==================================================

@ all
--------------------------------------------------

header
    width: 100% of screen/width
    height: 100px
    above: menu 0px

menu
    width: 100% of screen/width
    below: header 0px
    above: content 0px


footer
    width: 100% of screen/width
    height: > 100px

content
    inside: screen 0px left
    below: menu 0px



@ desktop, tablet
--------------------------------------------------

side-panel
    width: 300px
    below: menu 0px
    inside: screen 0px right
    near: content 0px right

menu
    height: 50px

footer
    below: content 0px

@ mobile
--------------------------------------------------
side-panel
    width: 100% of screen/width
    below: content 0px

content
    width: 100% of screen/width
    above: side-panel 0px

footer
    below: side-panel 0px
