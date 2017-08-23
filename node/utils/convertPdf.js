import _ from 'lodash'
import pdf from 'html-pdf'
import fs from 'fs'
import Mustache from 'mustache'

module.exports = (filename, content) =>
  new Promise(function(resolve, reject) {
    var template = fs.readFileSync('./templates/paper.html', 'utf8')

    var arrayToString = array => {
      var string = array[0]
      for (var a in array) {
        if (a > 0) {
          string = string + ', ' + array[a]
        }
      }
      return string
    }

    var authorsParser = (authors, affiliations) => {
      let newAuthors = JSON.parse(JSON.stringify(authors))
      _.map(newAuthors, (value, key) => {
        newAuthors[key] = _.extend({ id: '' }, newAuthors[key])
        if (key !== newAuthors.length - 1) {
          newAuthors[key].name = newAuthors[key].name + ', '
        }
        _.map(affiliations, (v, k) => {
          if (newAuthors[key].affiliation === v) {
            newAuthors[key].id = k + 1
          }
        })
      })
      return newAuthors
    }

    var affiliationsParser = affiliations => {
      let newAffiliations = []
      if (typeof affiliations !== 'string') {
        _.map(affiliations, (value, key) => {
          let a = {
            key: key + 1,
            name: value
          }
          newAffiliations.push(a)
        })
      } else {
        newAffiliations.push({
          name: affiliations
        })
      }
      return newAffiliations
    }

    Mustache.parse(template)
    const stuff = {
      title: content.title,
      authors: authorsParser(content.authors, content.affiliations),
      affiliations: affiliationsParser(content.affiliations),
      abstract: content.abstract,
      keywords:
        content.keywords &&
        (typeof content.keywords === 'string' ? content.keywords : arrayToString(content.keywords))
    }
    var html = Mustache.render(template, stuff)

    var options = {
      format: 'A4',
      type: 'pdf',
      phantomPath: './node_modules/phantomjs/bin/phantomjs'
    }

    pdf.create(html, options).toFile(`../public/files/${filename}.pdf`, function(err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res.filename)
      }
    })
  })
