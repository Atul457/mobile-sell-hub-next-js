import { MAIL } from '@/constants/mail.const'

const template = `<p
style="font-family: "Vidaloka", serif; mso-line-height-rule: exactly; margin-bottom: 0; font-size: 20px; font-weight: 600;">
Hi, [USER_NAME]<br>
</p>
<br>
<p
style="font-family: 'Poppins', sans-serif; mso-line-height-rule: exactly; margin: 0; margin-bottom: 24px;">
You’ve been invited by [INVITER] from [INVITER_ORGANIZATION] to join our platform, <span style="font-weight: 600;">${process.env.NEXT_PUBLIC_APP_NAME}</span>. 
<br>
Please click the button below to sign up:
</p>
<br>
<br>
<table cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td
    style="mso-line-height-rule: exactly; mso-padding-alt: 16px 24px; border-radius: 4px; background-color: #002047; font-family: Poppins, -apple-system, 'Segoe UI', sans-serif;">
    <a href="[COMPLETE_ACCOUNT_URL]"
        style="font-family: 'Rajdhani', sans-serif; mso-line-height-rule: exactly; display: block; padding-left: 24px; padding-right: 24px; padding-top: 16px; padding-bottom: 16px; font-size: 16px; font-weight: 600; line-height: 100%; color: #ffffff; text-decoration: none;">Visit &rarr;</a>
</td>
</tr>
</table>
<br>
<p
style="font-family: 'Poppins', sans-serif; mso-line-height-rule: exactly; margin: 0; margin-top: 24px; margin-bottom: 24px;">
Please note: This link can be used only once.
</p>
<p
style="font-family: 'Poppins', sans-serif; mso-line-height-rule: exactly; margin: 0;">
If you have any questions or need assistance, feel free to reach out to us at <a href="mailto:[APP_EMAIL]" style="font-weight: 600;text-decoration: none;color: #626262;">[APP_EMAIL]</a>.
</p>
<br>
`

const invitationTemplate = {
  template,
  subject: MAIL.SUBJECTS.INVITATION,
  keysToReplace: {
    userName: '[USER_NAME]',
    inviter: '[INVITER]',
    inviterDesignation: '[INVITER_DESIGNATION]',
    inviterOrganization: '[INVITER_ORGANIZATION]',
    completeAccountUrl: '[COMPLETE_ACCOUNT_URL]',
    appEmail: '[APP_EMAIL]'
  }
}

export { invitationTemplate }
