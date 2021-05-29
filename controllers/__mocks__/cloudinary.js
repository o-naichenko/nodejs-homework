module.exports.v2 = {
  config: () => {},
  uploader: {
    upload: (path, options, callback) => {
      callback(null, { public_id: 12345, secure_url: 'secureAvatarUrl' })
    },
  },
}
