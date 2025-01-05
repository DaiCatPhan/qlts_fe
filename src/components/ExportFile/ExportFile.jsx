import ExcelJS from "exceljs";
import fs from "fs";

async function EX_Excel({ header, data, nameFile }) {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Du lieu full data");

    worksheet.columns = header?.map((item) => {
      return {
        header: item?.header,
        key: item?.key,
      };
    });

    data?.forEach((item) => {
      const row = {};
      header?.forEach((hd) => {
        row[hd.key] = item[hd.key];
      });
      worksheet.addRow(row);
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Tạo URL tạm thời để tải xuống
      const url = window.URL.createObjectURL(blob);

      // Tạo thẻ a để kích hoạt tải xuống
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${nameFile}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  } catch (error) {
    console.error("Error generating Excel:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function PRINT_DATA({ header, data, nameFile, font = "12px" }) {
  try {
    // Tạo nội dung HTML cho in
    let content = `
      <html>
        <head>
          <title>${nameFile}</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
              font-size: ${font};
              text-align: left;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 4px;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <h1>${nameFile}</h1>
          <table>
            <thead>
              <tr>
                ${header
                  .map(
                    (item) => `
                  <th>${item?.header}</th>
                `
                  )
                  .join("")}
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (row) => `
                <tr>
                  ${header
                    .map(
                      (hd) => `
                    <td>${row[hd.key] || ""}</td>
                  `
                    )
                    .join("")}
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } else {
      console.error("Unable to open print window");
    }
  } catch (error) {
    console.error("Error printing data:", error);
  }
}

export default { EX_Excel, PRINT_DATA };
