export const emailTemplate = (title: string, body: string): string => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" rel="stylesheet">
    </head>
    <body>
        <div>
            <center style="width: 100%;
            table-layout: fixed;
            background-color: #133A7C;">
            <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
            <tr>
                <table width="600" style="
                margin: 0 auto;
                height: 70%;
                background-color: #133A7C;
                border-radius: 12px;
                text-align: center;">
                    <tr>
                        <td style=" text-align: justify;
                        text-justify: inter-word;
                        background-color: white;
                        padding: 5% 10%;
                        margin-top: 50px;
                        margin-bottom: 30px;
                     ">
                             <img style="margin: 0 auto;
                             vertical-align: middle;
                             padding-bottom: 75px;
                             display: block;
                             width: 150px;
                             filter: invert(1);
                         " src="https://drive.google.com/uc?export=view&id=1-6_nvfSZS1h3VaPzu-NdAXNb5JRd5rTk">
                            <h1 style="font-family: 'Roboto', sans-serif;
                            color: black
                            margin-top: 0;
                            margin-bottom: 20px;">${title},</h1>
                            <p style="font-family: 'Roboto', sans-serif;
                            color: black;
                            margin-top: 0;
                            margin-bottom: 20px;">${body}</p>

                            <p style="font-family: 'Roboto', sans-serif;
                            color: #133A7C;
                            margin-top: 0;
                            margin-bottom: 20px;">
                                Thank you, <br>
                                The Ford IMS Team.
                            </p>
                             </td>
                            </tr>
                        </table>
                    </tr>
                </table>
            </center>
        </div>
    </body>
    </html>
    `;
};