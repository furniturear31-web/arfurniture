'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Printer, ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'

export default function PrintBillPage() {
  const params = useParams()
  const router = useRouter()
  const [invoice, setInvoice] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInvoice = async () => {
      const supabase = createClient()
      
      const { data: inv, error: invErr } = await supabase.from('invoices').select('*').eq('id', params.id).single()
      if (invErr) {
        console.error(invErr)
        setLoading(false)
        return
      }
      setInvoice(inv)

      const { data: itm } = await supabase.from('invoice_items').select('*').eq('invoice_id', params.id).order('created_at', { ascending: true })
      if (itm) setItems(itm)

      const { data: pay } = await supabase.from('payments').select('*').eq('invoice_id', params.id).order('created_at', { ascending: true })
      if (pay && pay.length > 0) {
        setPayments(pay)
      } else {
        const { data: oldPay } = await supabase.from('invoice_payments').select('*').eq('invoice_id', params.id).order('created_at', { ascending: true })
        if (oldPay) setPayments(oldPay)
      }

      setLoading(false)
    }
    loadInvoice()
  }, [params.id])

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading beautiful bill...</div>
  if (!invoice) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Invoice not found.</div>

  const pendingAmount = invoice.total_amount - invoice.paid_amount;
  const whatsappMessage = `Hello ${invoice.customer_name},\n\nHere is your invoice ${invoice.invoice_number} from AR FURNITURE.\n\nTotal Amount: ₹${invoice.total_amount.toLocaleString('en-IN')}\nAdvance Paid: ₹${invoice.paid_amount.toLocaleString('en-IN')}\nBalance Due: ₹${pendingAmount.toLocaleString('en-IN')}\n\nYou can view and download your detailed bill here: https://ar-furniture.com/admin/bill-book/${invoice.id}/print\n\nThank you for choosing AR FURNITURE!`;

  return (
    <div className="min-h-screen bg-gray-100 py-6 print:py-0 print:bg-white text-black font-sans flex flex-col items-center">
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: A4; margin: 0; }
        }
      `}} />

      {/* Non-printable action bar */}
      <div className="w-full max-w-[800px] mb-4 px-4 print:hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back()
            } else {
              window.location.href = '/admin/bill-book'
            }
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-black font-semibold transition-colors w-full sm:w-auto bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div className="flex gap-3 w-full sm:w-auto">
          <a 
            href={`https://wa.me/91${invoice.customer_mobile}?text=${encodeURIComponent(whatsappMessage)}`} 
            target="_blank" rel="noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-all shadow-sm"
          >
            <Send size={18} /> WhatsApp
          </a>
          <button 
            onClick={() => window.print()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-sm"
          >
            <Printer size={18} /> Download / Print PDF
          </button>
        </div>
      </div>

      {/* A4 Printable Area Container for Mobile Scroll */}
      <div className="w-full overflow-x-auto print:overflow-visible flex justify-start sm:justify-center px-4 sm:px-0 pb-10 print:pb-0">
        <div className="w-[800px] shrink-0 bg-white shadow-2xl print:shadow-none print:w-full overflow-hidden relative flex flex-col" style={{ minHeight: '1123px' }}>
        
        {/* Top Header */}
        <div className="flex h-40 bg-[#1e293b] text-white relative overflow-hidden shrink-0">
          <div className="absolute top-0 bottom-0 left-[45%] w-16 bg-[#c8941a] -skew-x-[30deg] origin-bottom z-10"></div>
          <div className="absolute top-0 bottom-0 left-[45%] ml-16 w-full bg-slate-900 -skew-x-[30deg] origin-bottom z-0"></div>
          
          <div className="w-1/2 p-8 z-20 flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-wider text-white">AR FURNITURE</h1>
            <p className="text-[#c8941a] text-xs font-semibold tracking-[0.2em] mt-1">PREMIUM FURNITURE VADODARA</p>
          </div>
          
          <div className="w-1/2 p-8 z-20 flex flex-col justify-center items-end text-right">
            <h2 className="text-4xl font-bold text-[#c8941a] tracking-widest mb-1 uppercase">{invoice.document_type || 'INVOICE'}</h2>
            <p className="text-xs font-semibold tracking-wider text-gray-300 uppercase">NO : {invoice.invoice_number}</p>
            <p className="text-xs font-semibold tracking-wider text-gray-300 uppercase">DATE : {new Date(invoice.issue_date || invoice.created_at).toLocaleDateString('en-IN')}</p>
            {invoice.delivery_date && invoice.document_type === 'Order Form' && (
              <p className="text-xs font-semibold tracking-wider text-green-400 uppercase mt-1">DELIVERY : {new Date(invoice.delivery_date).toLocaleDateString('en-IN')}</p>
            )}
            {invoice.created_by && (
              <p className="text-xs font-semibold tracking-wider text-[#c8941a] uppercase mt-1">ISSUED BY : {invoice.created_by}</p>
            )}
          </div>
        </div>

        {/* Billing Info */}
        <div className="flex justify-between px-10 py-10 shrink-0">
          <div className="w-[45%] text-left">
            <h3 className="bg-[#1e293b] text-white inline-block px-3 py-1 text-xs font-bold mb-3 tracking-wider uppercase">
              {invoice.document_type === 'Receipt' ? 'Received By :' :
               invoice.document_type === 'Order Form' ? 'Order From :' :
               invoice.document_type === 'Quotation' ? 'Quotation From :' :
               'Invoice From :'}
            </h3>
            <p className="font-bold text-lg text-gray-900 leading-tight mb-1">AR FURNITURE</p>
            <p className="text-sm text-gray-600 font-medium">1-2 Shashtri Nagar, Nr. Purnima Nagar</p>
            <p className="text-sm text-gray-600 font-medium">New VIP Road, Vadodara, Gujarat</p>
            <p className="text-sm font-bold text-gray-800 mt-1">Ph: +91 85119 39151</p>
          </div>
          <div className="w-[45%] text-right">
            <h3 className="bg-[#1e293b] text-white inline-block px-3 py-1 text-xs font-bold mb-3 tracking-wider uppercase">
              {invoice.document_type === 'Receipt' ? 'Received From :' :
               invoice.document_type === 'Order Form' ? 'Order To :' :
               invoice.document_type === 'Quotation' ? 'Quotation To :' :
               'Invoice To :'}
            </h3>
            <p className="font-bold text-lg text-gray-900 leading-tight mb-1">{invoice.customer_name}</p>
            <p className="text-sm text-gray-600 font-medium mb-0.5">+91 {invoice.customer_mobile}</p>
            {invoice.customer_address && (
              <p className="text-sm text-gray-600 max-w-[260px] leading-snug ml-auto" style={{wordBreak:'normal', overflowWrap:'anywhere', whiteSpace:'normal'}}>{invoice.customer_address}</p>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="px-10 shrink-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#c8941a] text-white">
                <th className="py-2.5 px-4 text-xs font-bold tracking-wider uppercase w-12 text-center">#</th>
                <th className="py-2.5 px-4 text-xs font-bold tracking-wider uppercase">Description</th>
                <th className="py-2.5 px-4 text-xs font-bold tracking-wider uppercase text-center w-28">Price</th>
                <th className="py-2.5 px-4 text-xs font-bold tracking-wider uppercase text-center w-20">Qty</th>
                <th className="py-2.5 px-4 text-xs font-bold tracking-wider uppercase text-right w-32">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-b-2 border-[#1e293b]">
                  <td className="py-4 px-4 text-center text-sm font-bold text-gray-500 align-top">{index + 1}</td>
                  <td className="py-4 px-4 align-top">
                    <p className="font-bold text-sm text-gray-900">{item.description}</p>
                    {item.warranty && <p className="text-xs text-gray-500 mt-1 font-medium bg-gray-50 inline-block px-2 py-0.5 rounded border border-gray-100">Warranty: {item.warranty}</p>}
                  </td>
                  <td className="py-4 px-4 text-center text-sm font-semibold text-gray-700 align-top">₹{item.unit_price.toLocaleString('en-IN')}</td>
                  <td className="py-4 px-4 text-center text-sm font-bold text-gray-700 align-top">{item.quantity}</td>
                  <td className="py-4 px-4 text-right text-sm font-bold text-gray-900 align-top">₹{item.total.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Footer Info */}
        <div className="flex px-10 pt-10 pb-4 gap-8 flex-1">
          <div className="w-2/3 flex flex-col justify-start">
            <h3 className="bg-[#1e293b] text-white inline-block px-3 py-1 text-xs font-bold mb-3 tracking-wider uppercase">Payment Details :</h3>
            <div className="text-sm font-medium text-gray-700 space-y-1.5">
              {invoice.document_type === 'Receipt' ? (
                <>
                  <div className="flex gap-3">
                    <span className="text-gray-500 w-36">Order Value:</span>
                    <span className="font-bold text-gray-900">₹{invoice.total_amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-gray-500 w-36">Received:</span>
                    <span className="font-bold text-green-600">₹{invoice.paid_amount.toLocaleString('en-IN')} ({invoice.payment_mode || 'Cash'})</span>
                  </div>
                  {pendingAmount > 0 && (
                    <div className="flex gap-3">
                      <span className="text-gray-500 w-36">Balance Due:</span>
                      <span className="font-bold text-red-600">₹{pendingAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {pendingAmount === 0 && (
                    <div className="flex gap-3">
                      <span className="font-bold text-green-600">✓ FULLY PAID</span>
                    </div>
                  )}
                  <div className="flex gap-3 pt-3 mt-2 border-t border-gray-200 items-center">
                    <span className="text-gray-500 w-36 shrink-0">Payment Ref. No.:</span>
                    <span className="border-b border-gray-400 flex-1">&nbsp;</span>
                  </div>
                </>
              ) : (
                <>
                  {payments.length > 0 ? payments.map(p => (
                    <div key={p.id} className="flex gap-3">
                      <span className="text-gray-500 w-24">Received:</span>
                      <span className="font-bold">₹{p.amount.toLocaleString('en-IN')} ({p.payment_mode})</span>
                    </div>
                  )) : (
                    <div className="text-red-500 font-bold">No Payments Received</div>
                  )}
                  {pendingAmount > 0 && (
                    <div className="flex gap-3 pt-2 mt-1 border-t border-gray-200">
                      <span className="text-gray-500 w-24">Balance:</span>
                      <span className="font-bold text-red-600">₹{pendingAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {pendingAmount === 0 && (
                    <div className="flex gap-3 pt-2 mt-1 border-t border-gray-200">
                      <span className="font-bold text-green-600">✓ FULLY PAID</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-[#1e293b] mb-1">
                {invoice.document_type === 'Order Form' ? 'Thank you for your order!' :
                 invoice.document_type === 'Quotation' ? 'Thank you for considering AR FURNITURE!' :
                 invoice.document_type === 'Receipt' ? 'Thank you for your payment!' :
                 'Thank you for connecting with AR FURNITURE!'}
              </h2>
              <p className="text-xs text-gray-400">If you have any questions regarding this document, please contact us at +91 85119 39151.</p>
            </div>
          </div>
          
          <div className="w-1/3 flex flex-col justify-between">
            <div>
              <div className="flex justify-between py-2 text-sm font-bold text-gray-700">
                <span>Subtotal :</span>
                <span>₹{invoice.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between py-2 text-sm font-bold text-gray-700 border-b-2 border-gray-200 mb-3 pb-3">
                  <span>Discount :</span>
                  <span>₹{invoice.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              {invoice.document_type === 'Receipt' ? (
                <>
                  <div className="flex justify-between py-2 text-xs font-semibold text-gray-500 border-t border-gray-200">
                    <span>Order Value :</span>
                    <span>₹{invoice.total_amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center bg-green-600 text-white px-4 py-3 shadow-md">
                    <span className="font-bold tracking-wider text-sm">RECEIVED</span>
                    <span className="font-bold text-xl">₹{invoice.paid_amount.toLocaleString('en-IN')}</span>
                  </div>
                  {pendingAmount > 0 && (
                    <div className="flex justify-between items-center bg-red-100 text-red-700 px-4 py-2 mt-1 text-sm">
                      <span className="font-bold">BALANCE DUE</span>
                      <span className="font-bold">₹{pendingAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-between items-center bg-[#c8941a] text-white px-4 py-3 shadow-md">
                  <span className="font-bold tracking-widest">TOTAL</span>
                  <span className="font-bold text-xl">₹{invoice.total_amount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>
            
            <div className="mt-8 text-center flex flex-col items-center justify-end">
              <img src="/signature.png" alt="Signature" className="h-14 object-contain mb-[-8px] mix-blend-multiply" />
              <div className="border-t-2 border-[#1e293b] pt-1 inline-block min-w-[200px]">
                <p className="text-sm font-bold text-[#1e293b] uppercase tracking-wider">Authorized Signatory</p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms at the bottom */}
        <div className="px-10 pb-4 mt-auto">
          <div className="border-t border-gray-200 pt-3">
            <h4 className="text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Terms & Conditions:</h4>
            <p className="text-[9px] text-gray-500 whitespace-pre-wrap leading-snug font-medium">{invoice.terms}</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="h-12 bg-[#c8941a] relative overflow-hidden shrink-0 w-full">
          <div className="absolute top-0 bottom-0 left-0 w-[45%] bg-[#1e293b] skew-x-[30deg] origin-bottom -translate-x-12"></div>
        </div>

      </div>
      </div>
    </div>
  )
}
