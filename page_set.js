
on('ready', () => {
    const version = '1.1.0'; // script version
    log('-=> trav_aid v' + version + ' <=-');

    // catch the invocation command (!SW-Dice )
    on('chat:message', function (msg) {

        // Only run when message is an api type and contains call to this script
        if (msg.type === 'api' && msg.content.indexOf('!trav-aid') !== -1) {
			//sendChat("trav-aid", "\nCmd Line: " + msg.content);

            let args = [];
            // clean up command line noise and split on "--"
            args = msg.content
                .replace(/<br\/>\n/g, ' ')
                .replace(/(\{\{(.*?)\}\})/g, " $2 ")
                .split(/\s+--/);

            // bail out if api call is not to this script (tests cmd line cleaner)
            if (args.shift() !== "!trav-aid") {
                log('-=> trav-aid: command line parsing error - contact developer - exiting ... <=- ');
                return;
            }

            // After shifting out the api call args array should be
            // [0] = shop
            if (!(args[0])) {
                sendChat("trav-aid", "\nUsage: !trav-aid --shop|customs|trade|buyItem --uwp B789430-C  (system uwp code) --name (system name) --bases string --zone G|A|R");
                return;
            }
           
            // parse cmd line args
            let cmd_args = [];
			let cmd_uwp = "";
			let cmd_name = "";
			let cmd_bases = "";
			let cmd_itemTL = "";
			let cmd_diifficulty = "";
			let cmd_legality = "";
			
			let naval_base_present = false;
			let zone_amber = false;
			let zone_red = false;
			let cmd_zone = "";
            let aid_command_name = args[0]; // get command name shop, customs, ...
			args.shift(); // drop shop|trade|customs|... switch - now  args[0] = uwp B789430-C
			cmd_args = args[0].split(/\s+/);  // cmd_args[0] = uwp, [1] = B789430-C
			// sendChat("trav-aid", "\ncmd args[0] post split = " + cmd_args[0]);
			cmd_args.shift(); // drop uwp switch
			// sendChat("trav-aid", "\ncmd args[0] post shift = " + cmd_args[0]);
			//! trav-aid --shop --uwp B789439-C --name test
            if (aid_command_name === 'shop') {
				cmd_uwp = cmd_args[0]; // get uwp value
				args.shift(); // drop command name: args[0] = name pandora
			    cmd_args = args[0].split(/\s+/);
			    cmd_args.shift(); // drop name switch
				cmd_name = cmd_args[0]; // get name value
			}
			// !trav-aid --buyItem --uwp B789430-C --itemTL 0-15 --difficulty easy|hard --legality legal|banned
            else if (aid_command_name === 'buyItem') {
				cmd_uwp = cmd_args[0]; // get uwp value
				args.shift(); // drop command name: args[0] = name pandora
			    cmd_args = args[0].split(/\s+/);
			    cmd_args.shift(); // drop name switch
				cmd_name = cmd_args[0]; // get name value
				args.shift(); // args[0] = itemTL 10
			    cmd_args = args[0].split(/\s+/);  // cmd_args[0] = itemTL [1] = 10
			    cmd_args.shift(); // drop itemTL switch
				cmd_itemTL = cmd_args[0]; // get itemTL value
				args.shift(); // args[0] = difficulty easy
			    cmd_args = args[0].split(/\s+/);  // cmd_args[0] = difficulty [1] = easy
			    cmd_args.shift(); // drop difficulty switch
				cmd_difficulty = cmd_args[0]; // get difficulty value
				args.shift(); // args[0] = legality banned
			    cmd_args = args[0].split(/\s+/);  // cmd_args[0] = legality [1] = banned
			    cmd_args.shift(); // drop legality switch
				cmd_legality = cmd_args[0]; // get legality value				
			}

            else if (aid_command_name === 'trade') {
				cmd_uwp = cmd_args[0]; // get uwp value
			}
            else if (aid_command_name === 'customs') {
				cmd_uwp = cmd_args[0]; // get uwp value
				args.shift(); // drop command name: args[0] = name pandora
			    cmd_args = args[0].split(/\s+/);
			    cmd_args.shift(); // drop name switch
				cmd_name = cmd_args[0]; // get name value
				args.shift(); // drop command name: args[0] = name pandora
			    cmd_args = args[0].split(/\s+/);
			    cmd_args.shift(); // drop name switch
				cmd_bases = cmd_args[0]; // get name value
                // looking for Naval bases 
				if (cmd_bases.indexOf("D") > -1 || cmd_bases.indexOf("K") > -1 || cmd_bases.indexOf("N") > -1 || cmd_bases.indexOf("T") > -1 || cmd_bases.indexOf("C") > -1 || cmd_bases.indexOf("R") > -1 ) {
					naval_base_present = true;
				}
				args.shift(); // drop command name: args[0] = name pandora
			    cmd_args = args[0].split(/\s+/);
			    cmd_args.shift(); // drop name switch
				cmd_zone = cmd_args[0]; // get name value
                // looking for dangerous travel zones 
				if (cmd_zone.indexOf("A") > -1 ) {
					zone_amber=true;
				}
				if (cmd_zone.indexOf("R") > -1 ) {
					zone_red=true;
				}
			}
			else {
				sendChat("trav-aid", "\nUsage: !trav-aid --shop|customs --uwp B789430-C  (system uwp code) --name (system name) --bases string --zone G|A|R  Your command name =" + aid_command_name);
				return;
			}
			// sendChat("trav-aid", "\ncmd_uwp = " + cmd_uwp);
