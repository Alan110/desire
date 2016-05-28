
fis.set("project.ignore" , ['output/**', '.git/**', 'fis-conf.js']);

fis.match("*",{
    release : '$0'
});

fis.match("{*.tpl,view-*}",{
    release : false
});
