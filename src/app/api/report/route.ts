// import { dbConfig } from '@/configs/dbConfig'
// import { middlewares } from '@/utils/middlewares'
import { utils } from '@/utils/utils'
// import hl7 from 'simple-hl7';
// import fs from 'fs';
// import path from 'path';
// import { currentDateTime } from '@/utils/currentDateTime';
// import SFTPClient from 'ssh2-sftp-client';

export async function POST(_: Request) {
  return utils.errorHandler(async function () {
    // await dbConfig()
    // const body = await utils.getReqBody(request)
    // await middlewares.withUser(request)
    // const { pid, qrnumber } = body as any
    // const adt = new hl7.Message(
    //     "Novotech",
    //     "NVOTH",
    //     "LIMSABC",
    //     "main central",
    //     currentDateTime(),
    //     "",
    //     "ORM",
    //     "0dee417a-4371-4a07-8b49-c2fa77ca171d",
    //     "P",
    //     "2.7", "", "", "", "AL", ""
    // );

    // adt.addSegment("PID",
    //     1,
    //     `${pid ?? ''}`,
    //     "",
    //     "",
    //     ["Sample", "Novotech"],
    //     "",// Multiple components
    //     "19900101",
    //     "U",
    //     "",
    //     "0000-0",
    //     ["MAYBE NOVOTECH HQ", "", "Atlanta", "GA", "99999"],
    //     "",
    //     "",
    //     "",
    //     "",
    // );

    // adt.addSegment("PV1", 1, "U", "");
    // adt.addSegment("ORC",
    //     "NW", qrnumber, "", "", "", "", "", "", currentDateTime(), "",
    //     "", ["123456789", "Test Doctor"], "", "", currentDateTime(), ""
    // );

    // adt.addSegment("OBR",
    //     1, qrnumber, "", ["SARS-CoV-2_BXN", "SARS-CoV-2 BinaxNOW Rapid Antigen"], "",
    //     currentDateTime(), currentDateTime(), ""
    // );

    // adt.addSegment("DG1",
    //     1, "", ["Encounter for screening", "unspecified"], ""
    // );

    // adt.addSegment("NTE", 1, "HOLD", "");

    // const hl7Message = adt.log();
    // const filePath = path.join(process.cwd(), 'public', `CovidTest${pid}.hl7`);

    // fs.writeFile(filePath, hl7Message, async (err) => {
    //     if (err) {
    //         return Response.json(
    //             utils.generateRes({
    //                 status: false,
    //                 message: 'Error writing to file'
    //             })
    //         )
    //     }
    //     const hl7Message = adt.log();
    //     const filePath = path.join(process.cwd(), 'public', `CovidTest${pid}.hl7`);
    //     fs.writeFile(filePath, hl7Message, async (err) => {
    //         if (err) {
    //             return Response.json(
    //                 utils.generateRes({
    //                     status: false,
    //                     message: 'Error writing to file'
    //                 })
    //             )
    //         }

    //         // const sftp = new SFTPClient();

    //         try {
    //             await sftp.connect({
    //                 host: '',
    //                 port: 22,
    //                 username: '',
    //                 password: '',
    //             });

    //             // const remotePath = `/novotech/test/orders/`;

    //             // await sftp.put(filePath, remotePath);
    //             // await sftp.end();

    //             return Response.json(
    //                 utils.generateRes({
    //                     status: true,
    //                     message: `HL7 message saved to CovidTest${pid}.hl7 and uploaded to the SFTP server`
    //                 })
    //             );
    //         } catch (sftpErr) {
    //             console.error('SFTP Error:', sftpErr);
    //             return Response.json(
    //                 utils.generateRes({
    //                     status: false,
    //                     message: 'Error uploading file to SFTP server'
    //                 })
    //             );
    //         }
    //     });
    // });

    return Response.json(
      utils.generateRes({
        status: true
        // message: `HL7 message saved to CovidTest${pid}.hl7`
      })
    )
  })
}
