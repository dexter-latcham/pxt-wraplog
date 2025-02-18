//% color="#EB32D5" weight=100
namespace wraplogger {
    let columns: string[] = [];
    let insertedRows: number = 0;
    let lastTimestamp: number = -1;
    let bufferInstance: ringBuffer.circularBufferInstance = null;

    export class ColumnValue {
        public value: string;
        constructor(
            public column: string,
            value: any
        ) {
            this.value = "" + value;
        }
    }

    /**
     * A column and value to log to flash storage
     * @param column the column to set
     * @param value the value to set.
     * @returns A new value that can be stored in flash storage using log data
     */
    //% block="column $column value $value"
    //% value.shadow=math_number
    //% column.shadow=wraplogger_columnfield
    //% blockId=wraploggercreatecolumnvalue
    //% group="micro:bit (V2)"
    //% weight=80 
    export function createCV(column: string, value: any): ColumnValue {
        return new ColumnValue(column, value);
    }


    //% block="$column"
    //% blockId=wraplogger_columnfield
    //% group="micro:bit (V2)"
    //% blockHidden=true shim=TD_ID
    //% column.fieldEditor="autocomplete" column.fieldOptions.decompileLiterals=true
    //% column.fieldOptions.key="wraploggercolumn"
    export function _columnField(column: string) {
        return column
    }

    /**
     * Create a new buffer and set columns to be logged
     * @param col1 Title for first column to be added
     * @param col2 Title for second column to be added
     * @param col3 Title for third column to be added
     * @param col4 Title for fourth column to be added
     * @param col5 Title for fifth column to be added
     * @param col6 Title for sixth column to be added
     * @param col7 Title for seventh column to be added
     * @param col8 Title for eighth column to be added
     * @param col9 Title for ninth column to be added
     * @param col10 Title for tenth column to be added
     */
    //% block="create with columns $col1||$col2 $col3 $col4 $col5 $col6 $col7 $col8 $col9 $col10"
    //% blockId=wraploggercreatebuffer
    //% inlineInputMode="variable"
    //% inlineInputModeLimit=1
    //% group="micro:bit (V2)"
    //% weight=70
    //% col1.shadow=wraplogger_columnfield
    //% col2.shadow=wraplogger_columnfield
    //% col3.shadow=wraplogger_columnfield
    //% col4.shadow=wraplogger_columnfield
    //% col5.shadow=wraplogger_columnfield
    //% col6.shadow=wraplogger_columnfield
    //% col7.shadow=wraplogger_columnfield
    //% col8.shadow=wraplogger_columnfield
    //% col9.shadow=wraplogger_columnfield
    //% col10.shadow=wraplogger_columnfield
    export function createBufferWithColumns(
        col1: string,
        col2?: string,
        col3?: string,
        col4?: string,
        col5?: string,
        col6?: string,
        col7?: string,
        col8?: string,
        col9?: string,
        col10?: string
    ) : void {
        columns = [col1];
        if (col2) columns.push(col2);
        if (col3) columns.push(col3);
        if (col4) columns.push(col4);
        if (col5) columns.push(col5);
        if (col6) columns.push(col6);
        if (col7) columns.push(col7);
        if (col8) columns.push(col8);
        if (col9) columns.push(col9);
        if (col10) columns.push(col10);
        bufferInstance = new ringBuffer.circularBufferInstance();
        insertedRows = 0;
        lastTimestamp = -1;
    }

    /**
     * Log data to buffer
     * @param data4 [optional] fourth column and value to be logged
     * @param data5 [optional] fifth column and value to be logged
     * @param data6 [optional] sixth column and value to be logged
     * @param data7 [optional] seventh column and value to be logged
     * @param data8 [optional] eighth column and value to be logged
     * @param data9 [optional] ninth column and value to be logged
     * @param data10 [optional] tenth column and value to be logged
     */
    //% block="log data $data1||$data2 $data3 $data4 $data5 $data6 $data7 $data8 $data9 $data10"
    //% blockId=wraploggerlog
    //% data1.shadow=wraploggercreatecolumnvalue
    //% data2.shadow=wraploggercreatecolumnvalue
    //% data3.shadow=wraploggercreatecolumnvalue
    //% data4.shadow=wraploggercreatecolumnvalue
    //% data5.shadow=wraploggercreatecolumnvalue
    //% data6.shadow=wraploggercreatecolumnvalue
    //% data7.shadow=wraploggercreatecolumnvalue
    //% data8.shadow=wraploggercreatecolumnvalue
    //% data9.shadow=wraploggercreatecolumnvalue
    //% data10.shadow=wraploggercreatecolumnvalue
    //% inlineInputMode="variable"
    //% inlineInputModeLimit=1
    //% group="micro:bit (V2)"
    //% weight=100 
    export function logData(
        data1: wraplogger.ColumnValue,
        data2?: wraplogger.ColumnValue,
        data3?: wraplogger.ColumnValue,
        data4?: wraplogger.ColumnValue,
        data5?: wraplogger.ColumnValue,
        data6?: wraplogger.ColumnValue,
        data7?: wraplogger.ColumnValue,
        data8?: wraplogger.ColumnValue,
        data9?: wraplogger.ColumnValue,
        data10?: wraplogger.ColumnValue
    ): void {
        let dataMap: { [key: string]: string } = {};
        dataMap[data1.column] = data1.value;
        if (data2) dataMap[data2.column] = data2.value;
        if (data3) dataMap[data3.column] = data3.value;
        if (data4) dataMap[data4.column] = data4.value;
        if (data5) dataMap[data5.column] = data5.value;
        if (data6) dataMap[data6.column] = data6.value;
        if (data7) dataMap[data7.column] = data7.value;
        if (data8) dataMap[data8.column] = data8.value;
        if (data9) dataMap[data9.column] = data9.value;
        if (data10) dataMap[data10.column] = data10.value;

        // Add timestamp and calculate the time difference
        let currentTimestamp = control.millis();
        let timeDifference = lastTimestamp === -1 ? 0 : currentTimestamp - lastTimestamp;
        lastTimestamp = currentTimestamp;

        // Append time difference to the buffer
        bufferInstance.append(timeDifference);

        // Append each column value, or append 0 if the column is missing
        for (let col of columns) {
            let toInsert = dataMap[col] !== undefined ? parseInt(dataMap[col]) : 0;
            bufferInstance.append(toInsert);
        }

        insertedRows++;
    }




    //% block="save buffer"
    //% blockId=wraploggersavebuffer
    //% group="micro:bit (V2)"
    //% weight=60
    export function saveBuffer(): void {
        flashlog.clear(true);
        flashlog.setTimeStamp(FlashLogTimeStampFormat.None); // Don’t include current timestamps

        // First log the column titles with empty values
        flashlog.beginRow();
        flashlog.logData("time(ms)", "");
        for (let i = 0; i < columns.length; i++) {
            flashlog.logData(columns[i], "");
        }
        flashlog.endRow();

        let getIndex = 0;
        let maxInserts = bufferInstance.getMaxElements();
        let maxRows = Math.floor(maxInserts / (columns.length + 1));
        let count = Math.min(insertedRows, maxRows);

        // Adjust the starting index if there are more rows than maxRows
        if (insertedRows > maxRows) {
            getIndex = maxInserts % (columns.length + 1);
        }

        let cumulativeTime = 0;
        for (let i = 0; i < count; i++) {
            flashlog.beginRow();
            
            // Log the cumulative time
            let time = bufferInstance.get(getIndex);
            flashlog.logData("time(ms)", "" + cumulativeTime);
            cumulativeTime += time;
            getIndex = (getIndex + 1) % maxInserts;

            // Log each column value
            for (let j = 0; j < columns.length; j++) {
                let value = bufferInstance.get(getIndex);
                flashlog.logData(columns[j], "" + value);
                getIndex = (getIndex + 1) % maxInserts;
            }

            flashlog.endRow();
        }
    }
}
