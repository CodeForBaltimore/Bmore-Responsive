import models, { sequelize } from '../models';

const formatTime = (seconds) => {
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

const seedUsers = async () => {
  await models.User.create( 
    {
      username: 'goku',
      password: process.env.SEED_DATA_PASSWORD
    }
  )

  console.log(`Database seeding finished!`)
}

export default {
  formatTime,
  seedUsers
}