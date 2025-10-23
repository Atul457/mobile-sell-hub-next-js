import { MAIL } from '@/constants/mail.const'

const template = `
<p style="font-family: 'Poppins', sans-serif; mso-line-height-rule: exactly; margin-bottom: 0; font-size: 16px; font-weight: 400;">
   Dear [USER_NAME],
</p>
<br>
<p style="font-family: 'Poppins', sans-serif; mso-line-height-rule: exactly; margin: 0; margin-bottom: 24px;">
   Your sample report - [REPORT_ID] for [TEST_NAME] is now available for download.
   <br><br>
   Log in to your account to download the sample report.
</p>
<table cellpadding="0" cellspacing="0" role="presentation">
   <tbody>
      <tr>
         <td style="mso-line-height-rule: exactly; mso-padding-alt: 16px 24px; border-radius: 4px; background-color: #002047; font-family: Poppins, -apple-system, 'Segoe UI', sans-serif;">
            <a href="[LOGIN_URL]" style="font-family: 'Rajdhani', sans-serif; mso-line-height-rule: exactly; display: block; padding-left: 24px; padding-right: 24px; padding-top: 16px; padding-bottom: 16px; font-size: 16px; font-weight: 600; line-height: 100%; color: #ffffff; text-decoration: none;">Login →</a>
         </td>
      </tr>
   </tbody>
</table>
<br>
`

const reportProcessedTemplate = {
  template,
  subject: MAIL.SUBJECTS.REPORT_PROCESSED,
  keysToReplace: {
    userName: '[USER_NAME]',
    reportId: '[REPORT_ID]',
    testName: '[TEST_NAME]',
    loginUrl: '[LOGIN_URL]'
  }
}

export { reportProcessedTemplate }
