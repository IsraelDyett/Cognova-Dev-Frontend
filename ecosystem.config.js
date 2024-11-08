module.exports = {
    apps: [
        {
            name: 'cognova-app',
            script: 'npx',
            args: 'next start --port 3020',
            env: {
                PORT: 3020,
                NODE_ENV: 'production'
            },
            instances: 'max',
            exec_mode: 'cluster',
            watch: false,
            max_memory_restart: '1G',
            autorestart: true,
            restart_delay: 1000,
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            error_file: 'logs/error.log',
            out_file: 'logs/output.log',
            merge_logs: true,
            kill_timeout: 5000,
            metrics: {
                port: 9615
            }
        }
    ]
};