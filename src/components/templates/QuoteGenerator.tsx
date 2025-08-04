import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Send, Calculator, Calendar, MapPin, Phone, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { BUSINESS_INFO, OPERATIONAL_COSTS } from "@/lib/business-config"

interface QuoteLineItem {
  id: string
  description: string
  quantity: string
  unit: string
  unitPrice: string
  total: number
}

interface CustomerInfo {
  name: string
  address: string
  phone: string
  fax: string
  email: string
  siteLocation: string
}

interface QuoteData {
  quoteNumber: string
  date: string
  validUntil: string
  customer: CustomerInfo
  lineItems: QuoteLineItem[]
  salesTaxRate: string
  notes: string
  completionDays: string
}

export const QuoteGenerator = () => {
  const { toast } = useToast()
  
  const [quoteData, setQuoteData] = useState<QuoteData>({
    quoteNumber: `Q${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    customer: {
      name: "",
      address: "",
      phone: "",
      fax: "",
      email: "",
      siteLocation: ""
    },
    lineItems: [
      {
        id: "1",
        description: "1st Coat of Sealcoating",
        quantity: "",
        unit: "Sq. Feet",
        unitPrice: "0.08",
        total: 0
      }
    ],
    salesTaxRate: "5.75", // Virginia default
    notes: "",
    completionDays: "1"
  })

  // Pre-defined service items from Excel template
  const serviceTemplates = [
    { description: "1st Coat of Sealcoating", unit: "Sq. Feet", defaultPrice: "0.08" },
    { description: "2nd Coat of Sealcoating", unit: "Sq. Feet", defaultPrice: "0.05" },
    { description: "3rd Coat of Sealcoating", unit: "Sq. Feet", defaultPrice: "0.05" },
    { description: "Crack Sealing - Hot melt applied", unit: "Linear Feet", defaultPrice: "1.25" },
    { description: "Potholes, patches, repairs", unit: "Flat Rate", defaultPrice: "150.00" },
    { description: "Handicap spots, Parking Lines, Curbs", unit: "Flat Rate", defaultPrice: "200.00" },
    { description: "Oil spot priming - special treatment", unit: "Per Spot", defaultPrice: "15.00" },
    { description: "Sand Charge - improves durability", unit: "Per Sq. Ft.", defaultPrice: "0.02" },
    { description: "Polymer Additive Charge", unit: "Per Sq. Ft.", defaultPrice: "0.015" }
  ]

  const updateLineItem = (id: string, field: keyof Omit<QuoteLineItem, 'id' | 'total'>, value: string) => {
    setQuoteData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          const quantity = parseFloat(updated.quantity) || 0
          const unitPrice = parseFloat(updated.unitPrice) || 0
          updated.total = quantity * unitPrice
          return updated
        }
        return item
      })
    }))
  }

  const addLineItem = (template?: typeof serviceTemplates[0]) => {
    const newId = (quoteData.lineItems.length + 1).toString()
    const newItem: QuoteLineItem = {
      id: newId,
      description: template?.description || "",
      quantity: "",
      unit: template?.unit || "Each",
      unitPrice: template?.defaultPrice || "0.00",
      total: 0
    }
    
    setQuoteData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem]
    }))
  }

  const removeLineItem = (id: string) => {
    if (quoteData.lineItems.length > 1) {
      setQuoteData(prev => ({
        ...prev,
        lineItems: prev.lineItems.filter(item => item.id !== id)
      }))
    }
  }

  // Calculate totals
  const subtotal = quoteData.lineItems.reduce((sum, item) => sum + item.total, 0)
  const salesTax = subtotal * (parseFloat(quoteData.salesTaxRate) / 100)
  const total = subtotal + salesTax

  const generatePDF = () => {
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Quote ${quoteData.quoteNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
          .header { text-align: center; margin-bottom: 30px; }
          .company-info { background: #f5f5f5; padding: 15px; margin-bottom: 20px; }
          .quote-details { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .customer-info { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .totals { margin-left: 60%; }
          .total-row { font-weight: bold; background-color: #f0f0f0; }
          .terms { margin-top: 30px; font-size: 12px; }
          .signature { margin-top: 40px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${BUSINESS_INFO.name}</h1>
          <p>${BUSINESS_INFO.address}</p>
          <p>Phone: ${BUSINESS_INFO.phone} | Email: ${BUSINESS_INFO.email}</p>
        </div>

        <div class="quote-details">
          <div>
            <h2>Customer Quote No. ${quoteData.quoteNumber}</h2>
            <p><strong>Date:</strong> ${new Date(quoteData.date).toLocaleDateString()}</p>
          </div>
          <div>
            <p><strong>Completion Time:</strong> ${quoteData.completionDays} Day(s)</p>
            <p><strong>Valid Until:</strong> ${new Date(quoteData.validUntil).toLocaleDateString()}</p>
          </div>
        </div>

        <div class="customer-info">
          <p><strong>Customer:</strong> ${quoteData.customer.name}</p>
          <p><strong>Address:</strong> ${quoteData.customer.address}</p>
          <p><strong>Site Location:</strong> ${quoteData.customer.siteLocation}</p>
          <p><strong>Phone:</strong> ${quoteData.customer.phone} | <strong>Email:</strong> ${quoteData.customer.email}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${quoteData.lineItems.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>${item.unit}</td>
                <td>$${parseFloat(item.unitPrice).toFixed(2)}</td>
                <td>$${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <table style="width: 300px;">
            <tr><td>Subtotal:</td><td>$${subtotal.toFixed(2)}</td></tr>
            <tr><td>Sales Tax (${quoteData.salesTaxRate}%):</td><td>$${salesTax.toFixed(2)}</td></tr>
            <tr class="total-row"><td>Total:</td><td>$${total.toFixed(2)}</td></tr>
          </table>
        </div>

        ${quoteData.notes ? `<div><strong>Notes:</strong><br/>${quoteData.notes}</div>` : ''}

        <div class="terms">
          <p><strong>Terms & Conditions:</strong></p>
          <p>• Any alterations or deviations from above specifications will be done only with written orders, and will become an extra charge over and above this estimate.</p>
          <p>• Payments to be made as follows: 50% deposit required to begin work, 50% due upon completion.</p>
          <p>• This quote is valid for 30 days from the date above.</p>
          <p>• Weather conditions may affect scheduled completion date.</p>
        </div>

        <div class="signature">
          <p>We agree to have the work described above performed for the stated amount. We agree to the terms on the work specifications document and on this quote.</p>
          <br/>
          <p>Signed:____________________________ Date:_____________ Company:_____________________________</p>
          <br/>
          <p><em>Thank you for your business.</em></p>
        </div>
      </body>
      </html>
    `

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Quote_${quoteData.quoteNumber}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Quote Generated",
      description: `Quote ${quoteData.quoteNumber} has been downloaded as HTML file`,
    })
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          Professional Quote Generator
        </h1>
        <p className="text-muted-foreground">
          Generate professional customer quotes matching Excel template format
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Quote Input Form */}
        <div className="space-y-6">
          {/* Quote Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Quote Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quote Number</Label>
                  <Input
                    value={quoteData.quoteNumber}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, quoteNumber: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={quoteData.date}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valid Until</Label>
                  <Input
                    type="date"
                    value={quoteData.validUntil}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, validUntil: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Completion Time (Days)</Label>
                  <Input
                    type="number"
                    value={quoteData.completionDays}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, completionDays: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input
                  value={quoteData.customer.name}
                  onChange={(e) => setQuoteData(prev => ({
                    ...prev,
                    customer: { ...prev.customer, name: e.target.value }
                  }))}
                  placeholder="Business or Individual Name"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea
                  value={quoteData.customer.address}
                  onChange={(e) => setQuoteData(prev => ({
                    ...prev,
                    customer: { ...prev.customer, address: e.target.value }
                  }))}
                  placeholder="Customer address"
                  className="h-20"
                />
              </div>

              <div className="space-y-2">
                <Label>Site Location</Label>
                <Input
                  value={quoteData.customer.siteLocation}
                  onChange={(e) => setQuoteData(prev => ({
                    ...prev,
                    customer: { ...prev.customer, siteLocation: e.target.value }
                  }))}
                  placeholder="Job site location (if different)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={quoteData.customer.phone}
                    onChange={(e) => setQuoteData(prev => ({
                      ...prev,
                      customer: { ...prev.customer, phone: e.target.value }
                    }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={quoteData.customer.email}
                    onChange={(e) => setQuoteData(prev => ({
                      ...prev,
                      customer: { ...prev.customer, email: e.target.value }
                    }))}
                    placeholder="customer@email.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quote Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Quote Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Sales Tax Rate (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={quoteData.salesTaxRate}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, salesTaxRate: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">Virginia default: 5.75%</p>
              </div>

              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea
                  value={quoteData.notes}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Special instructions, conditions, or additional details..."
                  className="h-24"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Line Items and Preview */}
        <div className="space-y-6">
          {/* Line Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Services & Line Items
                </CardTitle>
                <div className="flex gap-2">
                  <Select onValueChange={(value) => addLineItem(serviceTemplates[parseInt(value)])}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Add Service" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTemplates.map((template, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {template.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => addLineItem()} variant="outline" size="sm">
                    Custom Item
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {quoteData.lineItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-3 border rounded-lg">
                  <div className="col-span-4 space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                      className="h-16 text-sm"
                      placeholder="Service description"
                    />
                  </div>
                  
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Quantity</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)}
                      className="text-sm"
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Unit</Label>
                    <Input
                      value={item.unit}
                      onChange={(e) => updateLineItem(item.id, 'unit', e.target.value)}
                      className="text-sm"
                      placeholder="Each"
                    />
                  </div>
                  
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Unit Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(item.id, 'unitPrice', e.target.value)}
                      className="text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="col-span-1 space-y-1">
                    <Label className="text-xs">Total</Label>
                    <div className="p-2 bg-muted text-center text-sm font-semibold rounded">
                      ${item.total.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeLineItem(item.id)}
                      disabled={quoteData.lineItems.length <= 1}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quote Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Quote Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Sales Tax ({quoteData.salesTaxRate}%):</span>
                  <span className="font-semibold">${salesTax.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <Button onClick={generatePDF} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Quote
                </Button>
                <Button variant="outline" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Email Quote
                </Button>
              </div>

              <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <p className="font-semibold mb-2">Quote includes:</p>
                <ul className="space-y-1">
                  <li>• Professional letterhead with company information</li>
                  <li>• Detailed service breakdown and pricing</li>
                  <li>• Standard terms and conditions</li>
                  <li>• Customer signature section</li>
                  <li>• 30-day validity period</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}