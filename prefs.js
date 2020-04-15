const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const Extension = imports.misc.extensionUtils.getCurrentExtension();

const Gettext = imports.gettext;
const _ = Gettext.domain('corona-tracker').gettext;

var Fields = {
    COUNTRY_NAME           : 'country-name'
};

const SCHEMA_NAME = 'org.gnome.shell.extensions.corona-tracker';

const getSchema = function () {
    let schemaDir = Extension.dir.get_child('schemas').get_path();
    let schemaSource = Gio.SettingsSchemaSource.new_from_directory(schemaDir, Gio.SettingsSchemaSource.get_default(), false);
    let schema = schemaSource.lookup(SCHEMA_NAME, false);

    return new Gio.Settings({ settings_schema: schema });
};

var SettingsSchema = getSchema();


function init() {
    let localeDir = Extension.dir.get_child('locale');
    if (localeDir.query_exists(null))
        Gettext.bindtextdomain('corona-tracker', localeDir.get_path());
}

const App = new Lang.Class({
    Name: 'CoronaTracker.App',
    _init: function() {
        this.main_hbox = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 20,
            border_width: 10
        });

        this.main_hbox.add(new Gtk.Label({label: _('Country')}));

        item = new Gtk.ComboBoxText();
        item.append("Afghanistan", "Afghanistan");
        item.append("Albania", "Albania");
        item.append("Algeria", "Algeria");
        item.append("Andorra", "Andorra");
        item.append("Angola", "Angola");
        item.append("Argentina", "Argentina");
        item.append("Armenia", "Armenia");
        item.append("Aruba", "Aruba");
        item.append("Australia", "Australia");
        item.append("Austria", "Austria");
        item.append("Azerbaijan", "Azerbaijan");
        item.append("Bahamas", "Bahamas");
        item.append("Bahrain", "Bahrain");
        item.append("Bangladesh", "Bangladesh");
        item.append("Barbados", "Barbados");
        item.append("Belarus", "Belarus");
        item.append("Belgium", "Belgium");
        item.append("Belize", "Belize");
        item.append("Benin", "Benin");
        item.append("Bermuda", "Bermuda");
        item.append("Bhutan", "Bhutan");
        item.append("Bolivia", "Bolivia");
        item.append("Brazil", "Brazil");
        item.append("Brunei", "Brunei");
        item.append("Bulgaria", "Bulgaria");
        item.append("Cambodia", "Cambodia");
        item.append("Cameroon", "Cameroon");
        item.append("Canada", "Canada");
        item.append("CAR", "CAR");
        item.append("Chad", "Chad");
        item.append("Chile", "Chile");
        item.append("China", "China");
        item.append("Colombia", "Colombia");
        item.append("Congo", "Congo");
        item.append("Croatia", "Croatia");
        item.append("Cuba", "Cuba");
        item.append("Curaçao", "Curaçao");
        item.append("Cyprus", "Cyprus");
        item.append("Czechia", "Czechia");
        item.append("Denmark", "Denmark");
        item.append("Djibouti", "Djibouti");
        item.append("Dominica", "Dominica");
        item.append("DRC", "DRC");
        item.append("Ecuador", "Ecuador");
        item.append("Egypt", "Egypt");
        item.append("Eritrea", "Eritrea");
        item.append("Estonia", "Estonia");
        item.append("Eswatini", "Eswatini");
        item.append("Ethiopia", "Ethiopia");
        item.append("Fiji", "Fiji");
        item.append("Finland", "Finland");
        item.append("France", "France");
        item.append("Gabon", "Gabon");
        item.append("Gambia", "Gambia");
        item.append("Georgia", "Georgia");
        item.append("Germany", "Germany");
        item.append("Ghana", "Ghana");
        item.append("Gibraltar", "Gibraltar");
        item.append("Greece", "Greece");
        item.append("Greenland", "Greenland");
        item.append("Grenada", "Grenada");
        item.append("Guadeloupe", "Guadeloupe");
        item.append("Guatemala", "Guatemala");
        item.append("Guinea", "Guinea");
        item.append("Guyana", "Guyana");
        item.append("Haiti", "Haiti");
        item.append("Honduras", "Honduras");
        item.append("Hungary", "Hungary");
        item.append("Iceland", "Iceland");
        item.append("India", "India");
        item.append("Indonesia", "Indonesia");
        item.append("Iran", "Iran");
        item.append("Iraq", "Iraq");
        item.append("Ireland", "Ireland");
        item.append("Israel", "Israel");
        item.append("Italy", "Italy");
        item.append("Jamaica", "Jamaica");
        item.append("Japan", "Japan");
        item.append("Jordan", "Jordan");
        item.append("Kazakhstan", "Kazakhstan");
        item.append("Kenya", "Kenya");
        item.append("Kuwait", "Kuwait");
        item.append("Kyrgyzstan", "Kyrgyzstan");
        item.append("Laos", "Laos");
        item.append("Latvia", "Latvia");
        item.append("Lebanon", "Lebanon");
        item.append("Liberia", "Liberia");
        item.append("Libya", "Libya");
        item.append("Liechtenstein", "Liechtenstein");
        item.append("Lithuania", "Lithuania");
        item.append("Luxembourg", "Luxembourg");
        item.append("Macao", "Macao");
        item.append("Madagascar", "Madagascar");
        item.append("Malaysia", "Malaysia");
        item.append("Maldives", "Maldives");
        item.append("Mali", "Mali");
        item.append("Malta", "Malta");
        item.append("Martinique", "Martinique");
        item.append("Mauritania", "Mauritania");
        item.append("Mauritius", "Mauritius");
        item.append("Mayotte", "Mayotte");
        item.append("Mexico", "Mexico");
        item.append("Moldova", "Moldova");
        item.append("Monaco", "Monaco");
        item.append("Mongolia", "Mongolia");
        item.append("Montenegro", "Montenegro");
        item.append("Montserrat", "Montserrat");
        item.append("Morocco", "Morocco");
        item.append("Mozambique", "Mozambique");
        item.append("Myanmar", "Myanmar");
        item.append("Namibia", "Namibia");
        item.append("Nepal", "Nepal");
        item.append("Netherlands", "Netherlands");
        item.append("Nicaragua", "Nicaragua");
        item.append("Nigeria", "Nigeria");
        item.append("Niger", "Niger");
        item.append("Norway", "Norway");
        item.append("Oman", "Oman");
        item.append("Pakistan", "Pakistan");
        item.append("Palestine", "Palestine");
        item.append("Panama", "Panama");
        item.append("Paraguay", "Paraguay");
        item.append("Peru", "Peru");
        item.append("Philippines", "Philippines");
        item.append("Poland", "Poland");
        item.append("Portugal", "Portugal");
        item.append("Qatar", "Qatar");
        item.append("Réunion", "Réunion");
        item.append("Romania", "Romania");
        item.append("Russia", "Russia");
        item.append("Rwanda", "Rwanda");
        item.append("Senegal", "Senegal");
        item.append("Serbia", "Serbia");
        item.append("Seychelles", "Seychelles");
        item.append("Singapore", "Singapore");
        item.append("Slovakia", "Slovakia");
        item.append("Slovenia", "Slovenia");
        item.append("Somalia", "Somalia");
        item.append("Spain", "Spain");
        item.append("Sudan", "Sudan");
        item.append("Suriname", "Suriname");
        item.append("Sweden", "Sweden");
        item.append("Switzerland", "Switzerland");
        item.append("Syria", "Syria");
        item.append("Taiwan", "Taiwan");
        item.append("Tanzania", "Tanzania");
        item.append("Thailand", "Thailand");
        item.append("Togo", "Togo");
        item.append("Tunisia", "Tunisia");
        item.append("Turkey", "Turkey");
        item.append("UAE", "UAE");
        item.append("Uganda", "Uganda");
        item.append("Ukraine", "Ukraine");
        item.append("UK", "UK");
        item.append("Uruguay", "Uruguay");
        item.append("USA", "USA");
        item.append("Uzbekistan", "Uzbekistan");
        item.append("Venezuela", "Venezuela");
        item.append("Vietnam", "Vietnam");
        item.append("World", "World");
        item.append("Zambia", "Zambia");
        item.append("Zimbabwe", "Zimbabwe");

        item.set_active(SettingsSchema.get_enum(Fields.COUNTRY_NAME));
        this.main_hbox.add(item);
        SettingsSchema.bind(Fields.COUNTRY_NAME, item, 'active-id', Gio.SettingsBindFlags.DEFAULT);
        this.main_hbox.show_all();

    }
});


function buildPrefsWidget(){
    let widget = new App();
    return widget.main_hbox;
}
