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
        item.append("China", "China");
        item.append("France", "France");
        item.append("Italy", "Italy");
        item.append("USA", "USA");
        item.append("Spain", "Spain");
        item.append("Germany", "Germany");
        item.append("Iran", "Iran");
        item.append("Switzerland", "Switzerland");
        item.append("UK", "UK");
        item.append("Netherlands", "Netherlands");
        item.append("Austria", "Austria");
        item.append("Belgium", "Belgium");
        item.append("Canada", "Canada");
        item.append("Norway", "Norway");
        item.append("Portugal", "Portugal");
        item.append("Australia", "Australia");
        item.append("Brazil", "Brazil");
        item.append("Sweden", "Sweden");
        item.append("Turkey", "Turkey");
        item.append("Israel", "Israel");
        item.append("Malaysia", "Malaysia");
        item.append("Denmark", "Denmark");
        item.append("Czechia", "Czechia");
        item.append("Ireland", "Ireland");
        item.append("Luxembourg", "Luxembourg");
        item.append("Japan", "Japan");
        item.append("Ecuador", "Ecuador");
        item.append("Chile", "Chile");
        item.append("Pakistan", "Pakistan");
        item.append("Poland", "Poland");
        item.append("Thailand", "Thailand");
        item.append("Romania", "Romania");
        item.append("Finland", "Finland");
        item.append("Greece", "Greece");
        item.append("Indonesia", "Indonesia");
        item.append("Iceland", "Iceland");
        item.append("Russia", "Russia");
        item.append("India", "India");
        item.append("Philippines", "Philippines");
        item.append("Singapore", "Singapore");
        item.append("Panama", "Panama");
        item.append("Qatar", "Qatar");
        item.append("Slovenia", "Slovenia");
        item.append("Argentina", "Argentina");
        item.append("Peru", "Peru");
        item.append("Colombia", "Colombia");
        item.append("Egypt", "Egypt");
        item.append("Croatia", "Croatia");
        item.append("Bahrain", "Bahrain");
        item.append("Mexico", "Mexico");
        item.append("Estonia", "Estonia");
        item.append("Serbia", "Serbia");
        item.append("Iraq", "Iraq");
        item.append("Lebanon", "Lebanon");
        item.append("UAE", "UAE");
        item.append("Algeria", "Algeria");
        item.append("Lithuania", "Lithuania");
        item.append("Armenia", "Armenia");
        item.append("Bulgaria", "Bulgaria");
        item.append("Taiwan", "Taiwan");
        item.append("Hungary", "Hungary");
        item.append("Morocco", "Morocco");
        item.append("Latvia", "Latvia");
        item.append("Uruguay", "Uruguay");
        item.append("Slovakia", "Slovakia");
        item.append("Kuwait", "Kuwait");
        item.append("Andorra", "Andorra");
        item.append("Tunisia", "Tunisia");
        item.append("Jordan", "Jordan");
        item.append("Moldova", "Moldova");
        item.append("Vietnam", "Vietnam");
        item.append("Albania", "Albania");
        item.append("Ukraine", "Ukraine");
        item.append("Cyprus", "Cyprus");
        item.append("Malta", "Malta");
        item.append("Réunion", "Réunion");
        item.append("Brunei", "Brunei");
        item.append("Venezuela", "Venezuela");
        item.append("Oman", "Oman");
        item.append("Senegal", "Senegal");
        item.append("Cambodia", "Cambodia");
        item.append("Ghana", "Ghana");
        item.append("Azerbaijan", "Azerbaijan");
        item.append("Belarus", "Belarus");
        item.append("Afghanistan", "Afghanistan");
        item.append("Kazakhstan", "Kazakhstan");
        item.append("Cameroon", "Cameroon");
        item.append("Georgia", "Georgia");
        item.append("Guadeloupe", "Guadeloupe");
        item.append("Palestine", "Palestine");
        item.append("Martinique", "Martinique");
        item.append("Uzbekistan", "Uzbekistan");
        item.append("Cuba", "Cuba");
        item.append("Montenegro", "Montenegro");
        item.append("Honduras", "Honduras");
        item.append("Nigeria", "Nigeria");
        item.append("Liechtenstein", "Liechtenstein");
        item.append("DRC", "DRC");
        item.append("Mauritius", "Mauritius");
        item.append("Kyrgyzstan", "Kyrgyzstan");
        item.append("Rwanda", "Rwanda");
        item.append("Bangladesh", "Bangladesh");
        item.append("Bolivia", "Bolivia");
        item.append("Paraguay", "Paraguay");
        item.append("Mayotte", "Mayotte");
        item.append("Monaco", "Monaco");
        item.append("Macao", "Macao");
        item.append("Kenya", "Kenya");
        item.append("Jamaica", "Jamaica");
        item.append("Gibraltar", "Gibraltar");
        item.append("Guatemala", "Guatemala");
        item.append("Togo", "Togo");
        item.append("Aruba", "Aruba");
        item.append("Madagascar", "Madagascar");
        item.append("Barbados", "Barbados");
        item.append("Uganda", "Uganda");
        item.append("Maldives", "Maldives");
        item.append("Tanzania", "Tanzania");
        item.append("Ethiopia", "Ethiopia");
        item.append("Zambia", "Zambia");
        item.append("Djibouti", "Djibouti");
        item.append("Dominica", "Dominica");
        item.append("Mongolia", "Mongolia");
        item.append("Haiti", "Haiti");
        item.append("Suriname", "Suriname");
        item.append("Niger", "Niger");
        item.append("Bermuda", "Bermuda");
        item.append("Namibia", "Namibia");
        item.append("Seychelles", "Seychelles");
        item.append("Curaçao", "Curaçao");
        item.append("Gabon", "Gabon");
        item.append("Benin", "Benin");
        item.append("Greenland", "Greenland");
        item.append("Guyana", "Guyana");
        item.append("Bahamas", "Bahamas");
        item.append("Fiji", "Fiji");
        item.append("Mozambique", "Mozambique");
        item.append("Syria", "Syria");
        item.append("Congo", "Congo");
        item.append("Eritrea", "Eritrea");
        item.append("Guinea", "Guinea");
        item.append("Eswatini", "Eswatini");
        item.append("Gambia", "Gambia");
        item.append("Sudan", "Sudan");
        item.append("Zimbabwe", "Zimbabwe");
        item.append("Nepal", "Nepal");
        item.append("Angola", "Angola");
        item.append("CAR", "CAR");
        item.append("Chad", "Chad");
        item.append("Laos", "Laos");
        item.append("Liberia", "Liberia");
        item.append("Myanmar", "Myanmar");
        item.append("Belize", "Belize");
        item.append("Bhutan", "Bhutan");
        item.append("Mali", "Mali");
        item.append("Mauritania", "Mauritania");
        item.append("Nicaragua", "Nicaragua");
        item.append("Grenada", "Grenada");
        item.append("Libya", "Libya");
        item.append("Montserrat", "Montserrat");
        item.append("Somalia", "Somalia");

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
