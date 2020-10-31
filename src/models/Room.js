class Room {
  name = "";
  owner = "";
  broadcaster = "";
  torrentFile = ArrayBuffer;
  users = [];

    constructor(name, owner, torrentFile) {
      this.name = name;
      this.owner = owner;
      this.torrentFile = torrentFile;
    }

    get Name(){
      return this.name;
    }

    get Owner() {
      return this.owner;
    }

    get Broadcaster() {
      return this.broadcaster;
    }

    set Broadcaster(id){
      this.broadcaster = id;
    }

    get TorrentFile(){
      return this.torrentFile;
    }

    get Users(){
      return this.users;
    }

    AddUser(user){
      this.users.push(user);
    }

    RemoveUser(user){
      for(let i=0; i<this.users.length; i++){
        if(this.users[i].id === user.id){
          delete this.users[i];
        }
      }
    }
  }

  module.exports = Room;