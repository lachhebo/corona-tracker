// Imports

const St = imports.gi.St;
const Gio = imports.gi.Gio; // Just for custom icon
const Main = imports.ui.main;

const Lang = imports.lang;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Util = imports.misc.util;
const Mainloop = imports.mainloop;
const Soup = imports.gi.Soup;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Prefs = Me.imports.prefs;

// Global variables

let metadata = Me.metadata;
let _SESSION = null;
let COUNTRY_NAME = 'World'

const USER_AGENT = 'GNOME Shell - COVID-19 Indicator (Extension)';
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
        this._label = new St.Label({text: label}); // Restructured as StBoxLayout's child meta was deprecated in 3.36 and removed in 3.38.
        this._value = new St.Label({text: value}, {x_align: St.Align.END}); // Restructured as StBoxLayout's child meta was deprecated in 3.36 and removed in 3.38.

        this.actor.add(this._label); // Restructured as StBoxLayout's child meta was deprecated in 3.36 and removed in 3.38.
        this.actor.add(this._value); // Restructured as StBoxLayout's child meta was deprecated in 3.36 and removed in 3.38.
        if(type){
          this.actor.add(new St.Icon({ icon_name: type, icon_size : 12})); // COVID-19 panel icons
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

        this._icon = Gio.icon_new_for_string(`${Me.path}/icons/virus-symbolic.svg`);
        this.panelIcon = new St.Icon({ gicon: this._icon, style_class: 'system-status-icon', icon_size: '16' });

        this.menu.removeAll();
        this.actor.add_actor(this.panelIcon);

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
        let request;
        if(COUNTRY_NAME === 'World'){
            request = Soup.Message.new('GET', 'https://corona.lmao.ninja/v2/all');
        }
        else{
            request = Soup.Message.new('GET', 'https://corona.lmao.ninja/v2/countries/'+ COUNTRY_NAME); 
        }
        this._get_soup_session().send_message (request);
        let result = JSON.parse(request.response_body.data);
        this._updateDisplay(result);
    },

    _updateDisplay: function(result){
        this.menu.removeAll();
        let section = new PopupMenu.PopupMenuSection("COVID");

        if(result){
            let country = new CoronaItem(null, 'Country:', COUNTRY_NAME);
            let separator0 = new PopupMenu.PopupSeparatorMenuItem();

            country.setMainSensor();
            section.addMenuItem(country);
            section.addMenuItem(separator0);

            let total_case = new CoronaItem(null, 'Total Cases:', result.cases.toLocaleString());
            let new_case = new CoronaItem('go-up-symbolic', 'New Cases:', result.todayCases.toLocaleString());
            let separator1 = new PopupMenu.PopupSeparatorMenuItem();

            let total_death = new CoronaItem('face-crying-symbolic', 'Total Deaths:', result.deaths.toLocaleString());
            let new_death = new CoronaItem('go-up-symbolic', 'New Deaths:', result.todayDeaths.toLocaleString());
            let separator2 = new PopupMenu.PopupSeparatorMenuItem();

            let recovered = new CoronaItem('face-smile-big-symbolic', 'Recovered:', result.recovered.toLocaleString());
            let active = new CoronaItem('face-plain-symbolic', 'Active:', result.active.toLocaleString());
            let critical = new CoronaItem('face-sad-symbolic', 'Critical:', result.critical.toLocaleString());
            let proportion = new CoronaItem(null, 'Cases / 1M pop:', result.casesPerOneMillion.toLocaleString());
            let death_proportion = new CoronaItem(null, 'Deaths / 1M pop:', result.deathsPerOneMillion.toLocaleString());
            let separator3 = new PopupMenu.PopupSeparatorMenuItem();

            total_case.setMainSensor();
            section.addMenuItem(total_case);
            proportion.setMainSensor();
            section.addMenuItem(proportion);
            new_case.setMainSensor();
            section.addMenuItem(new_case);
            section.addMenuItem(separator1);

            total_death.setMainSensor();
            section.addMenuItem(total_death);
            death_proportion.setMainSensor();
            section.addMenuItem(death_proportion);
            new_death.setMainSensor();
            section.addMenuItem(new_death);
            section.addMenuItem(separator2);

            active.setMainSensor();
            section.addMenuItem(active);
            critical.setMainSensor();
            section.addMenuItem(critical);
            recovered.setMainSensor();
            section.addMenuItem(recovered);
            section.addMenuItem(separator3);

           
        }
        else {
            let country = new CoronaItem('empty', 'ERROR', 'No internet connection');
            let separator0 = new PopupMenu.PopupSeparatorMenuItem();

            country.setMainSensor();
            section.addMenuItem(country);
            section.addMenuItem(separator0);
            
        }

        let refreshMenuItem = new PopupMenu.PopupMenuItem(_('Refresh'));
        section.addMenuItem(refreshMenuItem);
        refreshMenuItem.connect('activate', Lang.bind(this, this._queryAPI));

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