import AWS, { ses } from '../config/aws';
import { aws as awsConfig } from '../config/index';
import { frontEndHost } from '../config/index';

interface PasswordResetEmailParams {
	recipientEmail: string;
	token: string;
}

const facebookUrl = 'https://www.facebook.com/profile.php?id=61556591651905';
const instagramUrl = 'https://www.instagram.com/persona_chat/';
const twitterUrl = 'https://x.com/bybluemandarin?s=20';

const emailTemplate = (
	to: string,
	title: string,
	body: string,
	ctaText: string | null = '',
	ctaLink: string | null = '',
	image: string | null = '',
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
        <img src="https://persona-dev-assets.s3.ap-south-1.amazonaws.com/7ae66cc9bed94f8195ac32c22020641e.png" height="40" alt="Postdrop" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%; vertical-align: middle;">
 <h2 style="color: black; font-family: sans-serif; font-size: 24px; font-weight: bold;  display: inline-block; vertical-align: middle;">PersonaChat</h2>
    </a>
</td>

                                        
                            <td class="align-right" style="font-family: sans-serif; font-size: 14px; vertical-align: top; text-align: right;" valign="top" align="right">
                                <ul class="headerlinks" style="font-family: sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 15px;">
                                    <a href="${frontEndHost}/login" style="color: #1A56DB; text-decoration: none; font-size: 16px; margin-left: 10px;"><svg width="45" height="16" viewBox="0 0 45 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0.614347 12.5V0.863636H2.37003V10.9886H7.64276V12.5H0.614347ZM13.1854 12.6761C12.3672 12.6761 11.6532 12.4886 11.0433 12.1136C10.4335 11.7386 9.95999 11.214 9.62287 10.5398C9.28575 9.86553 9.11719 9.07765 9.11719 8.17614C9.11719 7.27083 9.28575 6.47917 9.62287 5.80114C9.95999 5.12311 10.4335 4.59659 11.0433 4.22159C11.6532 3.84659 12.3672 3.65909 13.1854 3.65909C14.0036 3.65909 14.7176 3.84659 15.3274 4.22159C15.9373 4.59659 16.4107 5.12311 16.7479 5.80114C17.085 6.47917 17.2536 7.27083 17.2536 8.17614C17.2536 9.07765 17.085 9.86553 16.7479 10.5398C16.4107 11.214 15.9373 11.7386 15.3274 12.1136C14.7176 12.4886 14.0036 12.6761 13.1854 12.6761ZM13.1911 11.25C13.7214 11.25 14.1607 11.1098 14.5092 10.8295C14.8577 10.5492 15.1153 10.1761 15.282 9.71023C15.4524 9.24432 15.5376 8.73106 15.5376 8.17045C15.5376 7.61364 15.4524 7.10227 15.282 6.63636C15.1153 6.16667 14.8577 5.78977 14.5092 5.50568C14.1607 5.22159 13.7214 5.07955 13.1911 5.07955C12.657 5.07955 12.2138 5.22159 11.8615 5.50568C11.513 5.78977 11.2536 6.16667 11.0831 6.63636C10.9164 7.10227 10.8331 7.61364 10.8331 8.17045C10.8331 8.73106 10.9164 9.24432 11.0831 9.71023C11.2536 10.1761 11.513 10.5492 11.8615 10.8295C12.2138 11.1098 12.657 11.25 13.1911 11.25ZM22.8089 15.9545C22.1158 15.9545 21.5192 15.8636 21.0192 15.6818C20.523 15.5 20.1177 15.2595 19.8033 14.9602C19.4889 14.661 19.254 14.3333 19.0987 13.9773L20.5589 13.375C20.6612 13.5417 20.7976 13.7178 20.968 13.9034C21.1423 14.0928 21.3771 14.2538 21.6726 14.3864C21.9718 14.5189 22.3563 14.5852 22.826 14.5852C23.4699 14.5852 24.0021 14.428 24.4226 14.1136C24.843 13.803 25.0533 13.3068 25.0533 12.625V10.9091H24.9453C24.843 11.0947 24.6953 11.3011 24.5021 11.5284C24.3127 11.7557 24.0514 11.9527 23.718 12.1193C23.3847 12.286 22.951 12.3693 22.4169 12.3693C21.7275 12.3693 21.1063 12.2083 20.5533 11.8864C20.004 11.5606 19.5684 11.0814 19.2464 10.4489C18.9283 9.8125 18.7692 9.0303 18.7692 8.10227C18.7692 7.17424 18.9264 6.37879 19.2408 5.71591C19.5589 5.05303 19.9946 4.54545 20.5476 4.19318C21.1006 3.83712 21.7275 3.65909 22.4283 3.65909C22.9699 3.65909 23.4074 3.75 23.7408 3.93182C24.0741 4.10985 24.3336 4.31818 24.5192 4.55682C24.7086 4.79545 24.8544 5.00568 24.9567 5.1875H25.0817V3.77273H26.7464V12.6932C26.7464 13.4432 26.5722 14.0587 26.2237 14.5398C25.8752 15.0208 25.4036 15.3769 24.8089 15.608C24.218 15.839 23.5514 15.9545 22.8089 15.9545ZM22.7919 10.9602C23.2805 10.9602 23.6934 10.8466 24.0305 10.6193C24.3714 10.3883 24.629 10.0587 24.8033 9.63068C24.9813 9.19886 25.0703 8.68182 25.0703 8.07955C25.0703 7.49242 24.9832 6.97538 24.8089 6.52841C24.6347 6.08144 24.379 5.73295 24.0419 5.48295C23.7048 5.22917 23.2881 5.10227 22.7919 5.10227C22.2805 5.10227 21.8544 5.23485 21.5135 5.5C21.1726 5.76136 20.915 6.11742 20.7408 6.56818C20.5703 7.01894 20.4851 7.52273 20.4851 8.07955C20.4851 8.65152 20.5722 9.15341 20.7464 9.58523C20.9207 10.017 21.1783 10.3542 21.5192 10.5966C21.8639 10.839 22.2881 10.9602 22.7919 10.9602ZM33.2592 12.5V3.77273H34.9581V12.5H33.2592ZM34.1172 2.42614C33.8217 2.42614 33.5679 2.32765 33.3558 2.13068C33.1475 1.92992 33.0433 1.69129 33.0433 1.41477C33.0433 1.13447 33.1475 0.895833 33.3558 0.698863C33.5679 0.498106 33.8217 0.397727 34.1172 0.397727C34.4126 0.397727 34.6645 0.498106 34.8729 0.698863C35.085 0.895833 35.1911 1.13447 35.1911 1.41477C35.1911 1.69129 35.085 1.92992 34.8729 2.13068C34.6645 2.32765 34.4126 2.42614 34.1172 2.42614ZM38.9425 7.31818V12.5H37.2436V3.77273H38.8743V5.19318H38.9822C39.183 4.73106 39.4974 4.35985 39.9254 4.07955C40.3572 3.79924 40.9008 3.65909 41.5561 3.65909C42.1508 3.65909 42.6716 3.78409 43.1186 4.03409C43.5656 4.2803 43.9122 4.64773 44.1584 5.13636C44.4046 5.625 44.5277 6.22917 44.5277 6.94886V12.5H42.8288V7.15341C42.8288 6.52083 42.6641 6.02652 42.3345 5.67045C42.005 5.31061 41.5523 5.13068 40.9766 5.13068C40.5826 5.13068 40.2322 5.21591 39.9254 5.38636C39.6224 5.55682 39.3819 5.80682 39.2038 6.13636C39.0296 6.46212 38.9425 6.85606 38.9425 7.31818Z" fill="#101828"/>
                                        </svg>
                                    </a>

                                    <a href="${twitterUrl}" style="color: #1A56DB; text-decoration: none; font-size: 16px; margin-left: 10px;"><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.2918 18.6251C13.8371 18.6251 17.9652 12.3724 17.9652 6.95167C17.9652 6.77589 17.9613 6.5962 17.9535 6.42042C18.7566 5.83967 19.4496 5.12033 20 4.2962C19.2521 4.62896 18.458 4.84627 17.6449 4.94074C18.5011 4.42755 19.1421 3.62135 19.4492 2.67159C18.6438 3.14892 17.763 3.48563 16.8445 3.6673C16.2257 3.00976 15.4075 2.57439 14.5164 2.4285C13.6253 2.28261 12.711 2.43433 11.9148 2.8602C11.1186 3.28607 10.4848 3.96238 10.1115 4.78455C9.73825 5.60672 9.64619 6.52897 9.84961 7.4087C8.21874 7.32686 6.62328 6.90321 5.16665 6.1652C3.71002 5.4272 2.42474 4.39132 1.39414 3.12472C0.870333 4.02782 0.710047 5.09649 0.945859 6.11353C1.18167 7.13057 1.79589 8.01966 2.66367 8.60011C2.01219 8.57943 1.37498 8.40402 0.804688 8.08839V8.13917C0.804104 9.08691 1.13175 10.0056 1.73192 10.7391C2.3321 11.4726 3.16777 11.9756 4.09687 12.1626C3.49338 12.3277 2.85999 12.3518 2.2457 12.2329C2.50788 13.048 3.01798 13.7609 3.70481 14.2721C4.39164 14.7833 5.22093 15.0673 6.07695 15.0845C4.62369 16.226 2.82848 16.8452 0.980469 16.8423C0.652739 16.8418 0.325333 16.8217 0 16.7821C1.87738 17.9866 4.06128 18.6263 6.2918 18.6251Z" fill="#98A2B3"/>
                                        </svg>
                                    </a>
                                    <a href="${facebookUrl}" style="color: #1A56DB; text-decoration: none; font-size: 16px; margin-left: 10px;"><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 10.5C20 4.97715 15.5229 0.5 10 0.5C4.47715 0.5 0 4.97715 0 10.5C0 15.4912 3.65684 19.6283 8.4375 20.3785V13.3906H5.89844V10.5H8.4375V8.29688C8.4375 5.79063 9.93047 4.40625 12.2146 4.40625C13.3084 4.40625 14.4531 4.60156 14.4531 4.60156V7.0625H13.1922C11.95 7.0625 11.5625 7.8334 11.5625 8.625V10.5H14.3359L13.8926 13.3906H11.5625V20.3785C16.3432 19.6283 20 15.4912 20 10.5Z" fill="#98A2B3"/>
                                        </svg>

                                    </a>

                                    <a href="${instagramUrl}" style="color: #1A56DB; text-decoration: none; font-size: 16px; margin-left: 10px;"><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_6007_33464)">
                                                <path d="M10 2.30078C12.6719 2.30078 12.9883 2.3125 14.0391 2.35937C15.0156 2.40234 15.543 2.56641 15.8945 2.70313C16.3594 2.88281 16.6953 3.10156 17.043 3.44922C17.3945 3.80078 17.6094 4.13281 17.7891 4.59766C17.9258 4.94922 18.0898 5.48047 18.1328 6.45312C18.1797 7.50781 18.1914 7.82422 18.1914 10.4922C18.1914 13.1641 18.1797 13.4805 18.1328 14.5313C18.0898 15.5078 17.9258 16.0352 17.7891 16.3867C17.6094 16.8516 17.3906 17.1875 17.043 17.5352C16.6914 17.8867 16.3594 18.1016 15.8945 18.2813C15.543 18.418 15.0117 18.582 14.0391 18.625C12.9844 18.6719 12.668 18.6836 10 18.6836C7.32813 18.6836 7.01172 18.6719 5.96094 18.625C4.98438 18.582 4.45703 18.418 4.10547 18.2813C3.64063 18.1016 3.30469 17.8828 2.95703 17.5352C2.60547 17.1836 2.39063 16.8516 2.21094 16.3867C2.07422 16.0352 1.91016 15.5039 1.86719 14.5313C1.82031 13.4766 1.80859 13.1602 1.80859 10.4922C1.80859 7.82031 1.82031 7.50391 1.86719 6.45312C1.91016 5.47656 2.07422 4.94922 2.21094 4.59766C2.39063 4.13281 2.60938 3.79688 2.95703 3.44922C3.30859 3.09766 3.64063 2.88281 4.10547 2.70313C4.45703 2.56641 4.98828 2.40234 5.96094 2.35937C7.01172 2.3125 7.32813 2.30078 10 2.30078ZM10 0.5C7.28516 0.5 6.94531 0.511719 5.87891 0.558594C4.81641 0.605469 4.08594 0.777344 3.45313 1.02344C2.79297 1.28125 2.23438 1.62109 1.67969 2.17969C1.12109 2.73438 0.78125 3.29297 0.523438 3.94922C0.277344 4.58594 0.105469 5.3125 0.0585938 6.375C0.0117188 7.44531 0 7.78516 0 10.5C0 13.2148 0.0117188 13.5547 0.0585938 14.6211C0.105469 15.6836 0.277344 16.4141 0.523438 17.0469C0.78125 17.707 1.12109 18.2656 1.67969 18.8203C2.23438 19.375 2.79297 19.7188 3.44922 19.9727C4.08594 20.2188 4.8125 20.3906 5.875 20.4375C6.94141 20.4844 7.28125 20.4961 9.99609 20.4961C12.7109 20.4961 13.0508 20.4844 14.1172 20.4375C15.1797 20.3906 15.9102 20.2188 16.543 19.9727C17.1992 19.7188 17.7578 19.375 18.3125 18.8203C18.8672 18.2656 19.2109 17.707 19.4648 17.0508C19.7109 16.4141 19.8828 15.6875 19.9297 14.625C19.9766 13.5586 19.9883 13.2188 19.9883 10.5039C19.9883 7.78906 19.9766 7.44922 19.9297 6.38281C19.8828 5.32031 19.7109 4.58984 19.4648 3.95703C19.2188 3.29297 18.8789 2.73438 18.3203 2.17969C17.7656 1.625 17.207 1.28125 16.5508 1.02734C15.9141 0.78125 15.1875 0.609375 14.125 0.5625C13.0547 0.511719 12.7148 0.5 10 0.5Z" fill="#98A2B3"/>
                                                <path d="M10 5.36328C7.16406 5.36328 4.86328 7.66406 4.86328 10.5C4.86328 13.3359 7.16406 15.6367 10 15.6367C12.8359 15.6367 15.1367 13.3359 15.1367 10.5C15.1367 7.66406 12.8359 5.36328 10 5.36328ZM10 13.832C8.16016 13.832 6.66797 12.3398 6.66797 10.5C6.66797 8.66016 8.16016 7.16797 10 7.16797C11.8398 7.16797 13.332 8.66016 13.332 10.5C13.332 12.3398 11.8398 13.832 10 13.832Z" fill="#98A2B3"/>
                                                <path d="M16.5391 5.16016C16.5391 5.82422 16 6.35938 15.3398 6.35938C14.6758 6.35938 14.1406 5.82031 14.1406 5.16016C14.1406 4.49609 14.6797 3.96094 15.3398 3.96094C16 3.96094 16.5391 4.5 16.5391 5.16016Z" fill="#98A2B3"/>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_6007_33464">
                                                    <rect width="20" height="20" fill="white" transform="translate(0 0.5)"/>
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </a>

                                </ul>
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
                                        <img src=${image} style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%;">
                                    </tr>
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
	type: string,
): Promise<AWS.SES.SendEmailResponse> {
	let image = '';
	if (type === 'otp') {
		image =
			'https://persona-dev-assets.s3.ap-south-1.amazonaws.com/ccfbddf14e00488c8409e6934041eee1.png';
	}
	if (type === 'survey') {
		image =
			'https://persona-dev-assets.s3.ap-south-1.amazonaws.com/5490c278c6b6454b8d95a60092c4553b.png';
	}
	const emailParams: AWS.SES.SendEmailRequest = {
		Destination: {
			ToAddresses: [to],
		},
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: emailTemplate(to, '', body, 'View Portal', frontEndHost, image),
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
