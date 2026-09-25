'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Plus, Trash2, Save, Printer } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  warranty?: string
}

export default function EditBillBookPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [existingInvoiceNum, setExistingInvoiceNum] = useState('')
  
  // Customer Details
  const [customerName, setCustomerName] = useState('')
  const [customerMobile, setCustomerMobile] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  
  // Items
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, unit_price: 0, warranty: '' }
  ])
  
  // Totals, Payment & Terms
  const [discount, setDiscount] = useState(0)
  const [advanceReceived, setAdvanceReceived] = useState(0)
  const [paymentMode, setPaymentMode] = useState('Cash')
  const [documentType, setDocumentType] = useState('Invoice')
  const [createdBy, setCreatedBy] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [terms, setTerms] = useState('1. Custom-made goods are non-returnable/non-exchangeable, subject to applicable law.\n2. Delivery, unloading & installation charges extra unless mentioned.\n3. Warranty as per mentioned terms; misuse, water/termite & normal wear not covered.\n4. Customer must verify product & specifications at delivery.\n5. Balance payment as agreed.')

  const handleDocumentTypeChange = (type: string) => {
    setDocumentType(type)
    if (type === 'Quotation') {
      setTerms('1. Quotation valid for 15 days.\n2. GST/taxes, delivery & installation extra unless mentioned.\n3. Price may change with changes in size, design, material or quantity.\n4. Delivery time is approximate.\n5. Order confirmed against customer approval & advance payment.')
    } else if (type === 'Order Form') {
      setTerms('1. Customer must confirm size, design, colour, fabric & material before production.\n2. Changes after confirmation may incur extra charges.\n3. Custom orders cannot be cancelled after production starts, subject to applicable law.\n4. Delivery/installation charges extra unless mentioned.\n5. Warranty as per agreed terms.')
    } else {
      // Invoice
      setTerms('1. Custom-made goods are non-returnable/non-exchangeable, subject to applicable law.\n2. Delivery, unloading & installation charges extra unless mentioned.\n3. Warranty as per mentioned terms; misuse, water/termite & normal wear not covered.\n4. Customer must verify product & specifications at delivery.\n5. Balance payment as agreed.')
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      // Fetch Invoice
      const { data: inv } = await supabase.from('invoices').select('*').eq('id', params.id).single()
      if (inv) {
        setExistingInvoiceNum(inv.invoice_number)
        setCustomerName(inv.customer_name || '')
        setCustomerMobile(inv.customer_mobile || '')
        setCustomerAddress(inv.customer_address || '')
        setDocumentType(inv.document_type || 'Invoice')
        setCreatedBy(inv.created_by || '')
        setDeliveryDate(inv.delivery_date || '')
        setDiscount(inv.discount || 0)
        setAdvanceReceived(inv.paid_amount || 0)
        setTerms(inv.terms || '')
      }

      // Fetch Items
      const { data: itms } = await supabase.from('invoice_items').select('*').eq('invoice_id', params.id)
      if (itms && itms.length > 0) {
        setItems(itms.map(i => ({
          id: i.id,
          description: i.description,
          quantity: i.quantity,
          unit_price: i.unit_price,
          warranty: i.warranty || ''
        })))
      }
      setPageLoading(false)
    }
    
    if (params.id) {
      fetchData()
    }
  }, [params.id])

  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0)
  const totalAmount = subtotal - discount
  const pendingAmount = totalAmount - advanceReceived

  const handleAddItem = () => {
    setItems([...items, { id: Math.random().toString(), description: '', quantity: 1, unit_price: 0, warranty: '' }])
  }

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value }
      }
      return item
    }))
  }

  const handleSaveBill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName || !customerMobile) {
      toast.error('Customer Name and Mobile are required')
      return
    }
    if (items.some(i => !i.description || i.unit_price <= 0)) {
      toast.error('Please fill all item descriptions and prices')
      return
    }
    
    setLoading(true)
    const toastId = toast.loading('Updating Document...')
    const supabase = createClient()

    try {
      let status = 'unpaid'
      if (advanceReceived >= totalAmount) status = 'paid'
      else if (advanceReceived > 0) status = 'partial'

      // 1. Update Invoice
      const { data: invoice, error: invError } = await supabase.from('invoices').update({
        customer_name: customerName,
        customer_mobile: customerMobile,
        customer_address: customerAddress,
        document_type: documentType,
        created_by: createdBy,
        subtotal,
        discount,
        total_amount: totalAmount,
        paid_amount: advanceReceived,
        status,
        terms,
        delivery_date: deliveryDate || null
      }).eq('id', params.id).select().single()

      if (invError) throw invError

      // 2. Delete and Insert Items
      await supabase.from('invoice_items').delete().eq('invoice_id', params.id)
      
      const itemsToInsert = items.map(item => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.quantity * item.unit_price,
        warranty: item.warranty || null
      }))
      
      const { error: itemsError } = await supabase.from('invoice_items').insert(itemsToInsert)
      if (itemsError) throw itemsError

      // 3. Sync Payments table if paid_amount on form > existing payments sum
      const { data: existingPays } = await supabase.from('payments').select('amount').eq('invoice_id', invoice.id)
      const existingSum = (existingPays || []).reduce((acc, p) => acc + Number(p.amount || 0), 0)
      if (advanceReceived > existingSum && customerMobile) {
        const diff = advanceReceived - existingSum
        await supabase.from('payments').insert({
          invoice_id: invoice.id,
          client_mobile: customerMobile,
          amount: diff,
          payment_mode: paymentMode,
          note: status === 'paid' ? 'Final Payment / Bill Cleared' : 'Payment at Billing'
        })
      }

      toast.success('Document updated successfully!', { id: toastId })
      router.push(`/admin/bill-book/${invoice.id}/print`)

    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Failed to update document', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return <div className="p-8 text-center text-gray-500">Loading document...</div>
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/bill-book" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Edit: {existingInvoiceNum}</h1>
          <p className="text-sm text-gray-500">Update items, change document type, or record new payments.</p>
        </div>
      </div>

      <form onSubmit={handleSaveBill} className="space-y-6">
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-[#eaeaea] shadow-sm flex-1">
            <label className="block text-xs font-bold text-[#c8941a] uppercase tracking-widest mb-2">Document Type</label>
            <select value={documentType} onChange={e => handleDocumentTypeChange(e.target.value)} className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#c8941a] transition-colors font-semibold">
              <option value="Invoice">Tax Invoice</option>
              <option value="Quotation">Quotation / Estimate</option>
              <option value="Order Form">Order Form / Confirmation</option>
            </select>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#eaeaea] shadow-sm flex-1">
            <label className="block text-xs font-bold text-[#c8941a] uppercase tracking-widest mb-2">Issued By (Staff Name)</label>
            <input type="text" placeholder="e.g. Rahul" value={createdBy} onChange={e => setCreatedBy(e.target.value)} className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#c8941a] transition-colors font-semibold" />
          </div>
          {documentType === 'Order Form' && (
            <div className="bg-white p-4 rounded-2xl border border-[#eaeaea] shadow-sm flex-1">
              <label className="block text-xs font-bold text-[#c8941a] uppercase tracking-widest mb-2">Delivery Date</label>
              <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#c8941a] transition-colors font-semibold" />
            </div>
          )}
        </div>
        
        {/* Customer Section */}
        <div className="bg-white p-6 rounded-2xl border border-[#eaeaea] shadow-sm">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Mobile Number *</label>
              <input type="text" required value={customerMobile} onChange={e => setCustomerMobile(e.target.value)} placeholder="e.g. 9876543210" className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#c8941a] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Customer Name *</label>
              <input type="text" required value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="e.g. Rahul Sharma" className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#c8941a] transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Address (Optional)</label>
              <input type="text" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} placeholder="Delivery Address..." className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#c8941a] transition-colors" />
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#eaeaea] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Bill Items</h2>
            <button type="button" onClick={handleAddItem} className="text-xs font-bold text-[#c8941a] flex items-center gap-1 hover:underline">
              <Plus size={14}/> Add Row
            </button>
          </div>
          
          <div className="hidden md:flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
            <div className="flex-1">Item Description (Custom)</div>
            <div className="w-24 text-center">Qty</div>
            <div className="w-32 text-right">Unit Price</div>
            <div className="w-32 text-right">Total</div>
            <div className="w-10"></div>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="bg-gray-50 md:bg-white p-3 md:p-0 rounded-xl md:rounded-none md:border-b border-gray-100 md:pb-4 md:last:border-0 md:last:pb-0">
                
                {/* Mobile Header per item */}
                <div className="flex justify-between items-center md:hidden mb-2 pb-2 border-b border-gray-200">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Item {index + 1}</span>
                  <button type="button" onClick={() => handleRemoveItem(item.id)} disabled={items.length === 1} className="text-red-400 hover:text-red-600 disabled:opacity-30">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 mb-2">
                  <div className="w-full md:flex-1">
                    <span className="md:hidden text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Description</span>
                    <input type="text" required placeholder="e.g. 6x6 Custom Teak Bed" value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#c8941a]" />
                  </div>
                  <div className="w-full md:w-24 flex gap-3 md:block">
                    <div className="w-20 md:w-full">
                      <span className="md:hidden text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Qty</span>
                      <input type="number" min="1" required value={item.quantity} onChange={e => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 1)} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm text-center focus:outline-none focus:border-[#c8941a]" />
                    </div>
                    <div className="flex-1 md:hidden">
                      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Unit Price (₹)</span>
                      <input type="number" min="0" required value={item.unit_price || ''} onChange={e => handleItemChange(item.id, 'unit_price', parseFloat(e.target.value) || 0)} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm text-right focus:outline-none focus:border-[#c8941a]" />
                    </div>
                  </div>
                  <div className="w-32 hidden md:block">
                    <input type="number" min="0" required value={item.unit_price || ''} onChange={e => handleItemChange(item.id, 'unit_price', parseFloat(e.target.value) || 0)} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm text-right focus:outline-none focus:border-[#c8941a]" />
                  </div>
                  <div className="w-full md:w-32 text-right font-bold text-gray-900 mt-1 md:mt-0 bg-gray-100 md:bg-transparent p-2 md:p-0 rounded-lg md:rounded-none flex justify-between md:block items-center">
                    <span className="md:hidden text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total</span>
                    <span className="text-sm">₹{(item.quantity * item.unit_price).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-10 hidden md:flex justify-end">
                    <button type="button" onClick={() => handleRemoveItem(item.id)} disabled={items.length === 1} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="w-full md:w-3/4 pl-0 md:pl-2">
                  <input type="text" placeholder="Warranty / Extra Details (e.g. 5 Years Warranty on Foam & Wood)" value={item.warranty || ''} onChange={e => handleItemChange(item.id, 'warranty', e.target.value)} className="w-full bg-white md:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs text-gray-600 focus:outline-none focus:border-[#c8941a]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals & Payment Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#fcfbf9] border border-[#f0ebe1] p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#c8941a] uppercase tracking-widest mb-4">Advance Payment</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Amount Received</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                    <input type="number" min="0" max={totalAmount} value={advanceReceived || ''} onChange={e => setAdvanceReceived(parseFloat(e.target.value) || 0)} className="w-full bg-white border border-gray-200 pl-8 pr-4 py-2.5 rounded-xl text-sm font-bold text-green-600 focus:outline-none focus:border-[#c8941a] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Payment Mode</label>
                  <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className="w-full bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#c8941a] transition-colors">
                    <option>Cash</option>
                    <option>UPI</option>
                    <option>Bank Transfer</option>
                    <option>Card</option>
                    <option>Cheque</option>
                  </select>
                </div>
              </div>
              {pendingAmount > 0 && advanceReceived > 0 && (
                <div className="text-xs text-red-500 font-medium flex items-center gap-1.5 bg-red-50 p-2.5 rounded-lg border border-red-100">
                  <span>⚠️ Balance remaining: <strong>₹{pendingAmount.toLocaleString('en-IN')}</strong></span>
                </div>
              )}
              {pendingAmount === 0 && advanceReceived > 0 && (
                <div className="text-xs text-green-600 font-medium flex items-center gap-1.5 bg-green-50 p-2.5 rounded-lg border border-green-100">
                  <span>âœ… Fully Paid</span>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-[#f0ebe1]">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Terms & Conditions</h2>
              <textarea 
                value={terms} 
                onChange={e => setTerms(e.target.value)}
                rows={4}
                className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-[#c8941a] text-gray-700"
              />
            </div>
          </div>

          <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Bill Summary</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center text-gray-300">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-medium text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <span className="flex items-center gap-2">
                  Discount
                  <input type="number" min="0" max={subtotal} value={discount || ''} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} className="w-20 bg-gray-800 border border-gray-700 px-2 py-1 rounded text-right focus:outline-none focus:border-[#c8941a]" />
                </span>
                <span className="font-medium text-red-400">- ₹{discount.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="h-px bg-gray-800 my-4"></div>
              
              <div className="flex justify-between items-center text-xl">
                <span className="font-bold text-gray-200">Total Amount</span>
                <span className="font-bold text-[#c8941a]">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <div className="mt-8">
              <button disabled={loading} type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#c8941a] to-[#e9a825] hover:from-[#e9a825] hover:to-[#c8941a] text-black font-bold rounded-xl transition-all shadow-lg hover:shadow-[#c8941a]/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? 'Saving...' : <><Save size={18} /> Save & Print</>}
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  )
}
