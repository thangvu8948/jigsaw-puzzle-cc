export enum DateFormat {
  MM_SS = 'mm:ss',
  HH_MM_SS = 'hh:mm:ss',
  D_HH_MM_SS = 'd hh:mm:ss',
  M_D_HH_MM_SS = 'md hh:mm:ss',
  Y_M_D_HH_MM_SS = 'ymd hh:mm:ss'
}
export class DateFormatter {
  public static formatSeconds(inputSeconds, format: DateFormat): string {
    var years = Math.floor(inputSeconds / (3600 * 24 * 365));
    var remainingSeconds = inputSeconds % (3600 * 24 * 365);
    var months = Math.floor(remainingSeconds / (3600 * 24 * 30));
    var remainingSeconds = remainingSeconds % (3600 * 24 * 30);
    var days = Math.floor(remainingSeconds / (3600 * 24));
    var remainingSeconds = remainingSeconds % (3600 * 24);
    var hours = Math.floor(remainingSeconds / 3600);
    var remainingSeconds = remainingSeconds % 3600;
    var minutes = Math.floor(remainingSeconds / 60);
    var seconds = remainingSeconds % 60;

    // Ensure two digits for minutes and seconds
    var formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
    var formattedSeconds = (seconds < 10 ? '0' : '') + seconds;
    var formattedHours = (hours < 10 ? '0' : '') + hours;
    var formattedDays = (days < 10 ? '0' : '') + days;
    var formattedMonths = (months < 10 ? '0' : '') + months;
    var formattedYears = (years < 10 ? '0' : '') + years;

    if (format === DateFormat.Y_M_D_HH_MM_SS) {
      return (
        formattedYears +
        '  ' +
        formattedMonths +
        'm' +
        formattedDays +
        'd ' +
        formattedHours +
        ':' +
        formattedMinutes +
        ':' +
        formattedSeconds
      );
    } else if (format === DateFormat.M_D_HH_MM_SS) {
      return (
        formattedMonths +
        ' months ' +
        formattedDays +
        ' days ' +
        formattedHours +
        ':' +
        formattedMinutes +
        ':' +
        formattedSeconds
      );
    } else if (format === DateFormat.D_HH_MM_SS) {
      return formattedDays + 'd ' + formattedHours + ':' + formattedMinutes + ':' + formattedSeconds;
    } else if (format === DateFormat.HH_MM_SS) {
      return formattedHours + ':' + formattedMinutes + ':' + formattedSeconds;
    } else if (format === DateFormat.MM_SS) {
      return formattedMinutes + ':' + formattedSeconds;
    } else {
      return 'Invalid format.';
    }
  }
}
