if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb+srv://jason123:jason123@jq-cluster-d5ofq.mongodb.net/test?retryWrites=true&w=majority'
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/vidjot-dev'
    }
}