/*
 * GET admin page.
 */

exports.admin = function(req, res){
  res.render('admin.ejs', { title: 'Something different' })
};