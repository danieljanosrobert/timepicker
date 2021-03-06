const constants = {
  reservationStatuses: ['Elfogadott', 'Elfogadásra vár', 'Visszaigazolásra vár'],
  colorOfReservationStatus: ['green', 'orange', 'purple'],
  validationErrorMessages: {
    required: 'A kitöltés kötelező',
    email: 'Nem megfelelő email formátum',
    passwordSameAs: 'A jelszavaknak meg kell egyezniük egymással',
    passwordMinLength: 'A jelszónak minimum 6 karakterből kell állnia',
    selectedWeekdays: 'Legalább egy napot ki kell választani',
    nameRegex: 'A mező csak betűket szóközt és (.-\') karaktereket tartalmazhat',
    serviceNameRegex: 'A mező csak számokat, betűket, szóközt és (.?!_-\'%=/*;$()+",) karaktereket tartalmazhat',
  },
  apiValidationMessages: {
    'Incorrect email or password': 'Helytelen email cím vagy jelszó',
    'Incorrect password': 'Helytelen jelszó',
    'Account with that email address already exists.': 'Az email cím már regisztrálva van',
  },
};

export default constants;
