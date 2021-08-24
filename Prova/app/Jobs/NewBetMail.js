'use strict'

const Mail = use('Mail');

class NewBetMail {

  static get concurrency () {
    return 1
  }


  static get key () {
    return 'NewBetMail-job'
  }


  async handle ({name, newGambles, allGames, email}) {
    console.log(`Job: ${NewBetMail.key}`);
    await Mail.send(
      ['emails.new_bet', 'emails.new_bet-text'],
      { name, betNumbers: newGambles, games: allGames },
      message => {
        message
          .to(email)
          .from('daniel@teste.com', 'Daniel |Teste')
          .subject('Nova aposta')
      }
    )
  }
}

module.exports = NewBetMail

