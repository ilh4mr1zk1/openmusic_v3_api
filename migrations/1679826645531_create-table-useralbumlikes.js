exports.up = (pgm) => {
  // membuat table useralbumlikes
  pgm.createTable("useralbumlikes", {

    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },

    user_id: {
      type: "VARCHAR(50)"
    },

    album_id: {
      type: "VARCHAR(50)"
    },

  });
  
  	pgm.addConstraint('useralbumlikes', 'fk_useralbumlikes.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  	pgm.addConstraint('useralbumlikes', 'fk_useralbumlikes.album_id_album.id', 'FOREIGN KEY(album_id) REFERENCES album(id) ON DELETE CASCADE');

};

exports.down = (pgm) => {
  // menghapus tabel useralbumlikes
  pgm.dropTable("useralbumlikes");
};

