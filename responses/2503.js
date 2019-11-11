module.exports = {
    data: {
        result: {
            AttachServerPath: "http://localhost:9000/BugFile/",
            DataLoggingChat: "localhost,9600",
            DataLoggingFTP: "localhost:21:data_log:123456:/DataLog",
            DataLoggingFTPCheck: "http://localhost:9000/md5.php?file_name=",
            DataLoggingSlientChat: "localhost,9600",
            DataLoggingSlientFTP: "localhost:21:data_log:123456:/DataLog",
            DataLoggingSlientFTPCheck: "http://localhost:8899/md5.php?file_name=",
            RpcFileSvr: "http://localhost/rpc_files/",
            RpcMd5Check: "http://localhost/md5x.aspx?file_name=rpc_files/",
            RpcSvr: "localhost,9600",
            RpcSvr_test: "localhost,9600",
            TroubleCodeSvr: "localhost,9600",
            Update: "localhost,9600"
        }
    },
    errcode: "S0000",
    success: 1
};
