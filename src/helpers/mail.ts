import AWS, { ses } from '../config/aws';
import { aws as awsConfig } from '../config/index';
import { frontEndHost } from '../config/index';

const emailTemplate = (
	to: string,
	title: string,
	body: string,
) => `<!doctype html>
<html>

<head>
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>${title}</title>
<style>
@media only screen and (max-width: 620px) {
  table[class=body] h1 {
    font-size: 28px !important;
    margin-bottom: 10px !important;
  }

  table[class=body] p,
table[class=body] ul,
table[class=body] ol,
table[class=body] td,
table[class=body] span,
table[class=body] a {
    font-size: 16px !important;
  }

  table[class=body] .wrapper,
table[class=body] .article {
    padding: 10px !important;
  }

  table[class=body] .content {
    padding: 0 !important;
  }

  table[class=body] .container {
    padding: 0 !important;
    width: 100% !important;
  }

  table[class=body] .main {
    border-left-width: 0 !important;
    border-radius: 0 !important;
    border-right-width: 0 !important;
  }

  table[class=body] .btn table {
    width: 100% !important;
  }

  table[class=body] .btn a {
    width: 100% !important;
  }

  table[class=body] .img-responsive {
    height: auto !important;
    max-width: 100% !important;
    width: auto !important;
  }
}
@media all {
  .ExternalClass {
    width: 100%;
  }

  .ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
    line-height: 100%;
  }

  .apple-link a {
    color: inherit !important;
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    text-decoration: none !important;
  }

  .btn-primary table td:hover {
          background-color: #1A56DB !important; 
        }
        .btn-primary a:hover {
          background-color: #1A56DB !important;
          border-color: #1A56DB !important; 
        } 
}
</style></head>

<body class style="background-color: #eaebed; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; background-color: #eaebed; width: 100%;" width="100%" bgcolor="#eaebed">
        <tr>
            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
            <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #ffffff; display: block; max-width: 580px; padding: 30px; width: 580px; margin: 0 auto;" width="580" valign="top" bgcolor="#ffffff">
                <div class="header" style="margin: 30px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
                        <tr>
                                            <td class="align-left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; text-align: left;" valign="top" align="left">
    <a href="${frontEndHost}" style="color: #1A56DB; text-decoration: underline; display: inline-block; vertical-align: middle;">
 <h2 style="color: black; font-family: sans-serif; font-size: 24px; font-weight: bold;  display: inline-block; vertical-align: middle;">SAAS Starter</h2>
    </a>
</td>

                                        
                            <td class="align-right" style="font-family: sans-serif; font-size: 14px; vertical-align: top; text-align: right;" valign="top" align="right">
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">

                    <!-- START CENTERED WHITE CONTAINER -->
                    <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Go to portal</span>
                    <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; background: #ffffff; border-radius: 3px; width: 100%;" width="100%">

                        <!-- START MAIN CONTENT AREA -->
                        <tr>
                            <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box;" valign="top">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
                                    <tr>
                                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">
                                            <h1 style="font-family: sans-serif; line-height: 1.4; margin-bottom: 30px; font-size: 30px; font-weight: 600; text-align: left; text-transform: capitalize; margin: 30px 24px 0 0; color: #344054;">${title}</h1>
                                            <p style="font-family: sans-serif; font-size: 16px; font-weight: normal; margin-bottom: 15px; margin: 24px; color: #344054;">${body}</p>
                                            <table style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; min-width: 100%; width: 100%; margin: 30px 24px;" role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" width="100%">
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <!-- END MAIN CONTENT AREA -->
                    </table>

                    <!-- START FOOTER -->

                    <!-- END FOOTER -->

                    <!-- END CENTERED WHITE CONTAINER -->
                </div>
            </td>
            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
        </tr>
    </table>
</body>

</html>
`;

export async function sendMail(
	to: string,
	subject: string,
	body: string,
): Promise<AWS.SES.SendEmailResponse> {
	const emailParams: AWS.SES.SendEmailRequest = {
		Destination: {
			ToAddresses: [to],
		},
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: emailTemplate(to, '', body),
				},
			},
			Subject: {
				Charset: 'UTF-8',
				Data: subject,
			},
		},
		Source: awsConfig.senderEmail || '',
	};

	// if (environment === 'development' || environment === 'preprod') {
	// 	return Promise.resolve({ MessageId: '' });
	// }

	return new Promise<AWS.SES.SendEmailResponse>((resolve, reject) => {
		ses.sendEmail(emailParams, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}
