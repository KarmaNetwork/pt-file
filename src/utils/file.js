import P2P from './connection.js'

/* 

let state = {}

state.promises = {};

state.promises.recv_data = {};

state.promises.recv_data.promise = new Promise( ( resolve, reject ) => {
  state.promises.recv_data.resolve = resolve;
  state.promises.recv_data.reject = reject;
} );

state.promises.on_open.promise = new Promise( ( resolve, reject ) => {
  state.promises.on_open.resolve = resolve;
  state.promises.on_open.reject = reject;
} );

state.ws = new WebSocket('ws://localhost:3000/bootstrap');

state.ws.onopen(() => {
  state.p2p = new P2P({
    handlers: {
      send_bootstrap(pk, data) {
    let s = {
      from: state.p2p.get_hex_key().publicKey,
      to: pk,
      data:data,
    }
    state.ws.send(JSON.stringify(s));
      },
      recv_data(pk, data) {
    state.promises.recv_data.resolve({
      pk: pk,
      data: data,
    })
      }
    }
  });
  console.log(`public key is ${state.p2p.get_hex_key().publicKey}`);
  state.promises.on_open.resolve();
});

state.ws.onmessage = (data) => {
  let m = JSON.parse(data);
  if (m.op == 'signal') {
    console.log(`recv signal from ${m.from}`);
    state.p2p.recv_bootstrap(m.from, m.data );
  }
}

*/

export default class FileTransfer {
    constructor( prefix, sender ) {
        this.prefix = prefix;

        this.ws = new WebSocket('ws://127.0.0.1:3000/bootstrap');

        this.p2p = new P2P( {
            handlers: {
                recv_bootstrap: (pk, data) => {
                    this.ws.send( {
                        from: this.p2p.get_hex_key().publicKey,
                        to: pk,
                        data: data,
                        op: 'signal',
                    } )
                },
                recv_data: (pk, data) => {
                    console.log(`receive data from ${pk}`);
                    if ( sender ) {
                        // let m = JSON.parse();
                    }
                }
            }
        });

        this.ws.onmessage = (data) => {
            let m = JSON.parse(data);
            if (m.op === 'signal') {
                console.log(`recv signal from ${m.from}`);
                this.p2p.recv_bootstrap(m.from, m.data );
            }
        }

        this.ws.onmessage = (data) => {
            let m = JSON.parse(data);
            if (m.op === 'signal') {
                console.log(`recv signal from ${m.from}`);
                this.p2p.recv_bootstrap(m.from, m.data );
            }
        }
    }

    getUrl(files) {
        this.files = files;
        return this.prefix + '/' + this.p2p.get_hex_key().publicKey;
    }
}

