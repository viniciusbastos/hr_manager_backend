import PDFDocument from 'pdfkit'
import fs, { existsSync } from 'fs'

interface WeaponData {
  name: string
  posto: string
  mat: string
  id: string
  weaponType: string
  model: string
  serialNumber: string
}

class WeaponRequestPDF {
  private doc: PDFKit.PDFDocument
  private weapon: WeaponData

  constructor(weapon: WeaponData) {
    this.weapon = weapon
    this.doc = new PDFDocument({ size: 'A4', margin: 50 })
    this.doc.initForm()
  }

  generatePDF(outputPath: string): void {
    const writeStream = fs.createWriteStream(outputPath)
    this.doc.pipe(writeStream)

    this.addHeader()
    this.addTitle()
    this.addMainContent()
    this.addSignatures()
    this.addCorregSection()
    this.addWeaponTable()

    this.doc.end()
  }

  private addHeader(): void {
    // Left Section
    this.doc
      .fontSize(10)
      .text('Chefe ALMOXARIFADO', -350, 50, { align: 'center' })
      .text('Ao: Sr Comandante Da OPM', { align: 'center' })

    // Add checkboxes
    const checkboxItems = ['Defiro', 'Indefiro', 'Publique-se', 'Arquive-se', 'Informar']
    let yPos = 80
    checkboxItems.forEach(item => {
      this.doc.rect(60, yPos, 10, 10).stroke().text(item, 75, yPos)
      yPos += 20
    })

    this.doc
      .text('Rio Real ___/____/2025', -350, yPos + 20, { align: 'center' })
      .text('____________________', -350, yPos + 40, { align: 'center' })
      .text('Almoxarife 6ªCIPM', -350, yPos + 60, { align: 'center' })
    this.doc.formText('basicField', 10, 10, 200, 30)

    // Center Section
    try {
      this.doc.image(
        'https://github.com/viniciusbastos/hr_manager_backend/blob/main/src/assets/pmba2.png',
        30,
        150,
        {
          fit: [100, 100],
          align: 'center',
          valign: 'center'
        }
      )
    } catch (error) {
      console.warn('Image not found, skipping logo')
    }
    this.doc
      .fontSize(12)
      .text('POLÍCIA MILITAR DA BAHIA', 50, 150, { align: 'center' })
      .text('CPR/L- 6ª CIPM', { align: 'center' })

    // Right Section
    this.doc
      .fontSize(10)
      .text('6ª CIPM - CMT OPM', 450, 50, { align: 'center' })
      .text('Ao: Chefe DO ALMOX', { align: 'center' })

    // Add right section checkboxes
    const rightCheckboxItems = ['Há Viabilidade', 'Publique-se', 'Não Há Viabilidade']
    yPos = 100
    rightCheckboxItems.forEach(item => {
      this.doc.rect(460, yPos, 10, 10).stroke().text(item, 475, yPos)
      yPos += 20
    })

    this.doc
      .text('Rio Real ___/____/2025', 420, yPos + 20, { align: 'center' })

      .text('____________________', 420, yPos + 40, { align: 'center' })
      .text('Cmt 6ªCIPM', 420, yPos + 60, { align: 'center' })
  }

  private addTitle(): void {
    this.doc.fontSize(14).text('REQUERIMENTO DE CARGA PESSOAL DE ARMA DE FOGO DA PMBA', 70, 300, {
      align: 'center',
      underline: true
    })
  }

  private addMainContent(): void {
    this.doc
      .fontSize(12)
      .text(`Eu, ${this.weapon.name}, ${this.weapon.posto}, Mat:${this.weapon.mat}`, 50, 350)
  }

  private addSignatures(): void {
    const signatureY = 400
    this.doc
      .moveTo(200, signatureY)
      .lineTo(400, signatureY)
      .stroke()
      .fontSize(10)
      .text(
        `${this.weapon.posto} ${this.weapon.name.toUpperCase()} - ${this.weapon.mat}`,
        120,
        signatureY + 5,
        { align: 'center' }
      )
  }

  private addCorregSection(): void {
    const corregY = 450
    this.doc
      .rect(50, corregY, 500, 150)
      .stroke()
      .fontSize(10)
      .text('Do: Chefe da Corregedoria Setorial', 60, corregY + 10)
      .text('Rio Real, ___/___/2025', 350, corregY + 10)
      .text('Ao: Sr. Comandante da OPM', 60, corregY + 30)
      .text('Informo a V.Sª que o Requerente:', 60, corregY + 50)
      .formText('multilineField', 60, corregY + 60, 480, 60, {
        multiline: true,
        align: 'left'
      })
      .stroke()
      .text('______________________________', 150, corregY + 120, { align: 'center' })
      .text('Chefe da CorSet', 150, corregY + 130, { align: 'center' })
  }

  private addWeaponTable(): void {
    const tableY = 700
    const columnWidths = [50, 300, 150]
    const headers = ['#', 'Descrição', 'N Serie']

    // Draw table headers
    let currentX = 50
    headers.forEach((header, i) => {
      this.doc
        .rect(currentX, tableY, columnWidths[i], 20)
        .stroke()
        .text(header, currentX + 5, tableY + 5)
      currentX += columnWidths[i]
    })

    // Draw table data
    currentX = 50
    const rowData = [
      this.weapon.id,
      `${this.weapon.weaponType} ${this.weapon.model}`,
      this.weapon.serialNumber
    ]

    rowData.forEach((data, i) => {
      this.doc
        .rect(currentX, tableY + 20, columnWidths[i], 20)
        .stroke()
        .text(data, currentX + 5, tableY + 25)
      currentX += columnWidths[i]
    })

    // Add BIR number
    this.doc.text('BIR Nº _______ de ___ / ___ / ___', 350, tableY + 50)
  }
}

// Usage example:
const weaponData: WeaponData = {
  name: 'John Doe',
  posto: 'Soldado',
  mat: '123456',
  id: '1',
  weaponType: 'Pistola',
  model: 'Taurus',
  serialNumber: 'ABC123'
}

const pdfGenerator = new WeaponRequestPDF(weaponData)
pdfGenerator.generatePDF('weapon-request.pdf')
