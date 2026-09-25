'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Printer, ArrowLeft, Send, CheckCircle, ShieldCheck } from 'lucide-react'

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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-zinc-50 font-sans text-zinc-600 font-semibold">Loading AR Furniture Document...</div>
  if (!invoice) return <div className="min-h-screen flex items-center justify-center bg-zinc-50 font-sans text-zinc-600 font-semibold">Document not found.</div>

  const pendingAmount = invoice.total_amount - invoice.paid_amount;
  const docType = invoice.document_type || 'INVOICE';

  // Dynamic Theme Colors based on Document Format
  const getTheme = () => {
    switch (docType) {
      case 'Order Form':
        return {
          headerBg: 'bg-gradient-to-r from-slate-950 via-zinc-900 to-amber-950',
          badgeBg: 'bg-amber-500 text-zinc-950',
          accentBorder: 'border-amber-500',
          accentText: 'text-amber-500',
          tableHeadBg: 'bg-zinc-900',
          totalBg: 'bg-amber-500 text-zinc-950'
        }
      case 'Quotation':
        return {
          headerBg: 'bg-gradient-to-r from-zinc-950 via-slate-900 to-zinc-900',
          badgeBg: 'bg-amber-400 text-zinc-950',
          accentBorder: 'border-amber-400',
          accentText: 'text-amber-400',
          tableHeadBg: 'bg-slate-900',
          totalBg: 'bg-amber-400 text-zinc-950'
        }
      case 'Receipt':
        return {
          headerBg: 'bg-gradient-to-r from-emerald-950 via-zinc-900 to-zinc-950',
          badgeBg: 'bg-emerald-500 text-white',
          accentBorder: 'border-emerald-500',
          accentText: 'text-emerald-400',
          tableHeadBg: 'bg-emerald-950',
          totalBg: 'bg-emerald-600 text-white'
        }
      default: // Invoice
        return {
          headerBg: 'bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950',
          badgeBg: 'bg-[#c8941a] text-zinc-950',
          accentBorder: 'border-[#c8941a]',
          accentText: 'text-[#c8941a]',
          tableHeadBg: 'bg-zinc-950',
          totalBg: 'bg-[#c8941a] text-zinc-950'
        }
    }
  }

  const theme = getTheme();

  const whatsappMessage = `Hello ${invoice.customer_name},\n\nHere is your ${docType} (${invoice.invoice_number}) from AR FURNITURE.\n\nTotal Amount: ₹${invoice.total_amount.toLocaleString('en-IN')}\nAmount Paid: ₹${invoice.paid_amount.toLocaleString('en-IN')}\nBalance Due: ₹${pendingAmount.toLocaleString('en-IN')}\n\nYou can view and download your detailed bill here:\nhttps://arfurniture.co.in/admin/bill-book/${invoice.id}/print\n\nThank you for choosing AR FURNITURE!`;

  return (
    <div className="min-h-screen bg-zinc-100 py-6 print:py-0 print:bg-white text-zinc-900 font-sans flex flex-col items-center">
      
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
          className="flex items-center gap-2 text-zinc-700 hover:text-black font-semibold transition-colors w-full sm:w-auto bg-white px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xs"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div className="flex gap-3 w-full sm:w-auto">
          <a 
            href={`https://wa.me/91${invoice.customer_mobile}?text=${encodeURIComponent(whatsappMessage)}`} 
            target="_blank" rel="noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-all shadow-xs text-sm"
          >
            <Send size={18} /> Send WhatsApp
          </a>
          <button 
            onClick={() => window.print()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-xs text-sm"
          >
            <Printer size={18} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* A4 Printable Container */}
      <div className="w-full overflow-x-auto print:overflow-visible flex justify-start sm:justify-center px-4 sm:px-0 pb-10 print:pb-0">
        <div className="w-[800px] shrink-0 bg-white shadow-2xl print:shadow-none print:w-full overflow-hidden relative flex flex-col" style={{ minHeight: '1123px' }}>
        
        {/* AR Furniture Premium Distinct Header Header Banner */}
        <div className={`p-8 ${theme.headerBg} text-white relative overflow-hidden shrink-0 border-b-4 border-[#c8941a]`}>
          
          {/* Subtle gold grid line accent background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#c8941a 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

          <div className="relative z-10 flex justify-between items-start">
            {/* Left Brand Identity */}
            <div>
              <div className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-bold tracking-[0.25em] text-amber-400 uppercase mb-2">
                Premium Custom Furniture
              </div>
              <h1 className="text-4xl font-black tracking-wider text-white font-serif">AR FURNITURE</h1>
              <p className="text-xs font-semibold text-zinc-300 tracking-[0.15em] mt-1">VADODARA, GUJARAT</p>
            </div>

            {/* Right Document Type & Metadata Card */}
            <div className="text-right">
              <span className={`inline-block px-4 py-1.5 rounded-lg text-xs font-black tracking-widest uppercase mb-2 shadow-md ${theme.badgeBg}`}>
                {docType}
              </span>
              <p className="text-sm font-bold text-white tracking-wider">NO : {invoice.invoice_number}</p>
              <p className="text-xs font-medium text-zinc-300 tracking-wide mt-0.5">DATE : {new Date(invoice.issue_date || invoice.created_at).toLocaleDateString('en-IN')}</p>
              {invoice.delivery_date && docType === 'Order Form' && (
                <p className="text-xs font-bold text-amber-400 tracking-wide mt-1">DELIVERY DATE : {new Date(invoice.delivery_date).toLocaleDateString('en-IN')}</p>
              )}
              {invoice.created_by && (
                <p className="text-[11px] font-semibold text-zinc-400 mt-1 uppercase">BY : {invoice.created_by}</p>
              )}
            </div>
          </div>
        </div>

        {/* Client & Billing Info Cards */}
        <div className="p-8 grid grid-cols-2 gap-6 shrink-0 bg-zinc-50/50 border-b border-zinc-200">
          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 border-b border-zinc-100 pb-1">
              {docType === 'Receipt' ? 'RECEIVED BY (SUPPLIER)' :
               docType === 'Order Form' ? 'ORDER FROM (SUPPLIER)' :
               docType === 'Quotation' ? 'QUOTATION FROM (SUPPLIER)' :
               'INVOICE FROM (SUPPLIER)'}
            </h3>
            <p className="font-bold text-base text-zinc-900">AR FURNITURE</p>
            <p className="text-xs text-zinc-600 mt-1 font-medium leading-relaxed">
              1-2 Shashtri Nagar, Nr. Purnima Nagar,<br />
              New VIP Road, Vadodara, Gujarat
            </p>
            <p className="text-xs font-bold text-zinc-800 mt-2 flex items-center gap-1">
              <span>Ph: +91 85119 39151 / +91 98983 75739</span>
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs text-right">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 border-b border-zinc-100 pb-1">
              {docType === 'Receipt' ? 'RECEIVED FROM (CLIENT)' :
               docType === 'Order Form' ? 'ORDER TO (CLIENT)' :
               docType === 'Quotation' ? 'QUOTATION TO (CLIENT)' :
               'INVOICE TO (CLIENT)'}
            </h3>
            <p className="font-bold text-base text-zinc-900">{invoice.customer_name}</p>
            <p className="text-xs text-zinc-700 font-bold mt-1">+91 {invoice.customer_mobile}</p>
            {invoice.customer_address && (
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed max-w-[260px] ml-auto font-medium" style={{wordBreak:'normal', overflowWrap:'anywhere'}}>{invoice.customer_address}</p>
            )}
          </div>
        </div>

        {/* Itemized Table Section */}
        <div className="p-8 shrink-0">
          <div className="rounded-xl overflow-hidden border border-zinc-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`${theme.tableHeadBg} text-white text-xs font-bold uppercase tracking-wider`}>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-4 text-center w-28">Rate</th>
                  <th className="py-3 px-4 text-center w-20">Qty</th>
                  <th className="py-3 px-4 text-right w-32">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-sm">
                {items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-zinc-50/50">
                    <td className="py-3.5 px-4 text-center font-bold text-zinc-400 text-xs align-top">{index + 1}</td>
                    <td className="py-3.5 px-4 align-top">
                      <p className="font-bold text-zinc-900">{item.description}</p>
                      {item.warranty && (
                        <p className="text-[11px] text-zinc-600 mt-1 font-semibold inline-flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                          <ShieldCheck size={12} className="text-amber-600" /> Warranty: {item.warranty}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center text-zinc-700 font-medium align-top">₹{item.unit_price.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-zinc-800 align-top">{item.quantity}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-zinc-900 align-top">₹{item.total.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Summary & Authorisation Section */}
        <div className="flex p-8 pt-2 gap-8 flex-1">
          {/* Left Details */}
          <div className="w-3/5 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 border-b border-zinc-200 pb-1">Payment Breakdown</h3>
              <div className="text-xs font-medium text-zinc-700 space-y-2 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                {docType === 'Receipt' ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Total Order Value:</span>
                      <span className="font-bold text-zinc-900">₹{invoice.total_amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between border-t border-zinc-200 pt-2">
                      <span className="text-zinc-500">Amount Received:</span>
                      <span className="font-bold text-emerald-600">₹{invoice.paid_amount.toLocaleString('en-IN')} ({invoice.payment_mode || 'Cash'})</span>
                    </div>
                    {pendingAmount > 0 ? (
                      <div className="flex justify-between border-t border-zinc-200 pt-2">
                        <span className="text-zinc-500">Balance Remaining:</span>
                        <span className="font-bold text-red-600">₹{pendingAmount.toLocaleString('en-IN')}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between border-t border-zinc-200 pt-2 text-emerald-600 font-bold">
                        <span>Status:</span>
                        <span>✓ FULLY PAID</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {payments.length > 0 ? (
                      payments.map((p, idx) => (
                        <div key={p.id || idx} className="flex justify-between">
                          <span className="text-zinc-500">Payment Received:</span>
                          <span className="font-bold text-zinc-900">₹{p.amount.toLocaleString('en-IN')} ({p.payment_mode || 'Cash'})</span>
                        </div>
                      ))
                    ) : invoice.paid_amount > 0 ? (
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Advance / Paid Amount:</span>
                        <span className="font-bold text-emerald-600">₹{invoice.paid_amount.toLocaleString('en-IN')} ({invoice.payment_mode || 'Cash'})</span>
                      </div>
                    ) : (
                      <div className="text-red-500 font-bold">No Payments Recorded</div>
                    )}
                    {pendingAmount > 0 ? (
                      <div className="flex justify-between border-t border-zinc-200 pt-2 text-red-600 font-bold">
                        <span>Balance Due:</span>
                        <span>₹{pendingAmount.toLocaleString('en-IN')}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between border-t border-zinc-200 pt-2 text-emerald-600 font-bold">
                        <span>Status:</span>
                        <span>✓ FULLY PAID</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-bold text-zinc-900 mb-1">
                {docType === 'Order Form' ? 'Thank you for your order!' :
                 docType === 'Quotation' ? 'Thank you for considering AR FURNITURE!' :
                 docType === 'Receipt' ? 'Thank you for your payment!' :
                 'Thank you for connecting with AR FURNITURE!'}
              </h4>
              <p className="text-[11px] text-zinc-500">For queries regarding this document, please contact us at +91 85119 39151.</p>
            </div>
          </div>

          {/* Right Totals & Signatory */}
          <div className="w-2/5 flex flex-col justify-between text-right">
            <div className="space-y-2 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              <div className="flex justify-between text-xs font-semibold text-zinc-600">
                <span>Subtotal:</span>
                <span>₹{invoice.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-xs font-semibold text-zinc-600 border-b border-zinc-200 pb-2">
                  <span>Discount:</span>
                  <span>- ₹{invoice.discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className={`flex justify-between items-center px-4 py-3 rounded-xl shadow-xs mt-2 ${theme.totalBg}`}>
                <span className="font-bold text-xs uppercase tracking-wider">GRAND TOTAL</span>
                <span className="font-black text-lg">₹{invoice.total_amount.toLocaleString('en-IN')}</span>
              </div>

              {pendingAmount > 0 && (
                <div className="flex justify-between items-center bg-red-50 text-red-700 px-3 py-2 rounded-lg text-xs font-bold mt-2 border border-red-200">
                  <span>BALANCE DUE</span>
                  <span>₹{pendingAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Gulfam Signature Stamp */}
            <div className="mt-6 flex flex-col items-center justify-end">
              <img src="/signature.png" alt="Gulfam Authorized Signature" className="h-14 object-contain mb-[-6px] mix-blend-multiply" />
              <div className="border-t-2 border-zinc-900 pt-1 w-full text-center">
                <p className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Authorized Signatory</p>
                <p className="text-[10px] font-semibold text-zinc-500">AR FURNITURE</p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Footer Note */}
        <div className="px-8 pb-4 mt-auto">
          <div className="border-t border-zinc-200 pt-3">
            <h4 className="text-[10px] font-bold text-zinc-800 uppercase tracking-wider mb-1">Terms & Conditions:</h4>
            <p className="text-[9px] text-zinc-500 whitespace-pre-wrap leading-snug font-medium">{invoice.terms}</p>
          </div>
        </div>

        {/* Bottom Luxury Dual Accent Bar */}
        <div className="h-3 bg-zinc-900 shrink-0 w-full relative">
          <div className="h-1.5 bg-[#c8941a] w-full" />
        </div>

      </div>
      </div>
    </div>
  )
}
