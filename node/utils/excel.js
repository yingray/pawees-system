var XLSX = require('xlsx')
var _ = require('lodash')

module.exports = coll =>
  new Promise((resolve, reject) => {
    try {
      const sheets = ['delegate', 'accom', 'paper', 'flight', 'tour']
      const x = {
        delegate: [],
        accom: [],
        paper: [],
        flight: [],
        tour: []
      }
      _.map(coll, (value, key) => {
        delete value.delegate.password
        x.delegate[key] = value.delegate
        x.accom[key] = Object.assign({}, { email: value.delegate.email }, value.accom)
        x.paper[key] = Object.assign({}, { email: value.delegate.email }, value.paper)
        x.tour[key] = Object.assign({}, { email: value.delegate.email }, value.tour)
        x.flight[key] = Object.assign({}, { email: value.delegate.email })
        if (_.has(value.flight, 'arrival')) {
          x.flight[key] = Object.assign(
            {},
            x.flight[key],
            _.mapKeys(value.flight.arrival, (v, k) => `Arrival(${k})`),
            _.mapKeys(value.flight.departure, (v, k) => `Departure(${k})`)
          )
        }
      })

      const colls = x

      var ws_name = 'Delegate'

      var wscols = [
        { wpx: 130 }, // "characters"
        { wpx: 130 }, // "pixels"
        { wpx: 130 },
        { wpx: 130 },
        { wpx: 130 }
      ]

      var wsrows = [{ hpt: 30 }]

      var wb = XLSX.utils.book_new()

      _.map(sheets, v => {
        var ws = XLSX.utils.json_to_sheet(colls[v], { cellDates: true })
        XLSX.utils.book_append_sheet(wb, ws, v)
        ws['!cols'] = wscols
        ws['!rows'] = wsrows
      })

      wb.Props = {
        Title: 'PAWEES database',
        Subject: 'Tests',
        Author: 'Devs at SheetJS',
        Manager: 'Sheet Manager',
        Company: 'SheetJS',
        Category: 'Experimentation',
        Keywords: 'Test',
        Comments: 'Nothing to say here',
        LastAuthor: 'Not SheetJS',
        CreatedDate: new Date()
      }

      if (!wb.Workbook) wb.Workbook = { Sheets: [], WBProps: {} }
      if (!wb.Workbook.WBProps) wb.Workbook.WBProps = {}
      wb.Workbook.WBProps.filterPrivacy = true
      var wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' }
      var wbout = XLSX.write(wb, wopts)

      function s2ab(s) {
        var buf = new ArrayBuffer(s.length)
        var view = new Uint8Array(buf)
        for (var i = 0; i != s.length; ++i)
          view[i] = s.charCodeAt(i) & 0xff
        return buf
      }

      resolve(s2ab(wbout))
    } catch (err) {
      reject(err)
    }
  })
