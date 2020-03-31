// Imports
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;


const Lang = imports.lang;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Util = imports.misc.util;
const Mainloop = imports.mainloop;
const Clutter = imports.gi.Clutter;
const Soup = imports.gi.Soup;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Prefs = Me.imports.prefs;

// Global variables

let metadata = Me.metadata;
let _SESSION = null;
let COUNTRY_NAME = 'france'

const USER_AGENT = 'GNOME Shell - Covid-19 Indicator-GS - extension';
const HTTP_TIMEOUT = 10;
const LOOP_UPDATE_TIME = 60*60*12; // every 12 hour, the result will be updated 

// Functions


const CoronaItem = new Lang.Class({
    Name: 'CoronaItem',
    Extends: PopupMenu.PopupBaseMenuItem,

    _init: function(type, label, value) {
        this.parent();
        this.connect('activate', function () {
        });
        this._label = label;
        this._value = value;

        
        this.actor.add(new St.Label({text: label}));
        this.actor.add(new St.Label({text: value}), {align: St.Align.END});
        if(type){
          this.actor.add(new St.Icon({ icon_name: type, icon_size : 12}));
        }
    },

    getPanelString: function() {
        return this._value;
    },

    setMainSensor: function() {
        //this.setOrnament(PopupMenu.Ornament.DOT);
    },

    getLabel: function() {
        return this._label;
    },
});




const CoronaMenuButton = new Lang.Class({
    Name: 'CoronaMenuButton',
    Extends: PanelMenu.Button,

    _init: function(){
        this.parent(null, 'coronaMenu');
        this._loadSettings();

        this._coronaOutput= '';

        this.statusLabel = new St.Icon({style_class: 'virus-icon'})
        this.menu.removeAll();
        this.actor.add_actor(this.statusLabel);

        // don't postprone the first call by update-time.
        this._queryAPI();

        this._eventLoop = Mainloop.timeout_add_seconds(LOOP_UPDATE_TIME, Lang.bind(this, function (){
            this._queryAPI();
            // readd to update queue
            return true;
        }));

    },

    _onDestroy: function(){
        Mainloop.source_remove(this._eventLoop);
        this.menu.removeAll();
        this._settings.disconnect(this._settingsChangedId);
        this._settingsChangedId = null;
    },

    _loadSettings: function () {
        this._settings = Prefs.SettingsSchema;
        this._settingsChangedId = this._settings.connect('changed',
            Lang.bind(this, this._onSettingsChange));

        this._fetchSettings();

    },


    _fetchSettings: function () {
        COUNTRY_NAME           = this._settings.get_string(Prefs.Fields.COUNTRY_NAME);
    },


    _onSettingsChange: function () {
        var that = this;

        // Load the settings into variables
        that._fetchSettings();
        this._queryAPI();

    },

     
    _get_soup_session: function() {
        if(_SESSION === null) {
                _SESSION = new Soup.Session();
                Soup.Session.prototype.add_feature.call(
                    _SESSION,
                    new Soup.ProxyResolverDefault()
                );
                _SESSION.user_agent = USER_AGENT;
                _SESSION.timeout = HTTP_TIMEOUT;
            }
        
        return _SESSION;
	},

    _queryAPI: function(){
        let request = Soup.Message.new('GET', 'https://corona.lmao.ninja/countries/'+ COUNTRY_NAME); 
        this._get_soup_session().send_message (request);
        let result = JSON.parse(request.response_body.data);
        this._updateDisplay(result);
    },


    _updateDisplay: function(result){
        this.menu.removeAll();
        let section = new PopupMenu.PopupMenuSection("Covid");

        if(result){
            let country = new CoronaItem(null, 'Country Name', COUNTRY_NAME);
            let separator0 = new PopupMenu.PopupSeparatorMenuItem();

            country.setMainSensor();
            section.addMenuItem(country);
            section.addMenuItem(separator0);

            let total_case = new CoronaItem(null, 'Total Cases', String(result.cases));
            let new_case = new CoronaItem('go-up-symbolic', 'New Cases', String(result.todayCases));
            let separator1 = new PopupMenu.PopupSeparatorMenuItem();

            let total_death = new CoronaItem(null, 'Total Deaths', String(result.deaths));
            let new_death = new CoronaItem('go-up-symbolic', 'New Deaths', String(result.todayDeaths));
            let separator2 = new PopupMenu.PopupSeparatorMenuItem();

            let recovered = new CoronaItem('face-smile-big-symbolic', 'Recovered', String(result.recovered));
            let active = new CoronaItem(null, 'Active', String(result.active));
            let critical = new CoronaItem(null, 'Critical', String(result.critical));
            let proportion = new CoronaItem(null, 'Cases / 1M pop', String(result.casesPerOneMillion));
            let separator3 = new PopupMenu.PopupSeparatorMenuItem();


            total_case.setMainSensor();
            section.addMenuItem(total_case);
            new_case.setMainSensor();
            section.addMenuItem(new_case);
            section.addMenuItem(separator1);

            total_death.setMainSensor();
            section.addMenuItem(total_death);
            new_death.setMainSensor();
            section.addMenuItem(new_death);
            section.addMenuItem(separator2);

            recovered.setMainSensor();
            section.addMenuItem(recovered);
            active.setMainSensor();
            section.addMenuItem(active);
            critical.setMainSensor();
            section.addMenuItem(critical);
            proportion.setMainSensor();
            section.addMenuItem(proportion);
            section.addMenuItem(separator3);

           
        }
        else {
            let country = new CoronaItem('empty', 'ERROR', 'No internet connection');
            let separator0 = new PopupMenu.PopupSeparatorMenuItem();

            country.setMainSensor();
            section.addMenuItem(country);
            section.addMenuItem(separator0);
            
        }

        let settingsMenuItem = new PopupMenu.PopupMenuItem(_('Settings'));
        section.addMenuItem(settingsMenuItem);
        settingsMenuItem.connect('activate', Lang.bind(this, this._openSettings));
        this.menu.addMenuItem(section);

        
    },


    _openSettings: function () {
        Util.spawn([
            "gnome-shell-extension-prefs",
            Me.uuid
        ]);
    },


});



let coronaMenu;

function init() {
}

function enable() {
    coronaMenu = new CoronaMenuButton();
    Main.panel.addToStatusArea('coronaMenu', coronaMenu, 1, 'right');
}


function disable() {
    coronaMenu.destroy();
    coronaMenu = null;
}
