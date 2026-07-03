import React, { useState } from 'react';

const contactReasons = [
  'General Inquiry',
  'List My Station',
  'Fleet Partnership',
  'EV Charging Partnership',
  'Bug Report',
  'Media & Press',
  'Careers',
];

const offices = [
  { city: 'Delhi (HQ)', address: 'Floor 12, Connaught Place, New Delhi 110001', phone: '+91 11-4567-8900', email: 'hello@fuel-india.in' },
  { city: 'Bangalore', address: 'HSR Layout, Sector 2, Bangalore 560102', phone: '+91 80-4123-4567', email: 'bangalore@fuel-india.in' },
  { city: 'Mumbai', address: 'BKC, Bandra East, Mumbai 400051', phone: '+91 22-6789-0123', email: 'mumbai@fuel-india.in' },
];

const faqs = [
  { q: 'How do I list my fuel station on Fuel-India?', a: 'Fill out the contact form with "List My Station" as the reason. Our team will verify your station and add it within 48 hours.' },
  { q: 'Is Fuel-India free to use?', a: 'Yes! Finding stations, planning routes, and checking queues is completely free. We offer premium features for fleet operators.' },
  { q: 'How accurate is the queue prediction?', a: 'Our AI achieves 92% accuracy for stations with 10+ community reports. Accuracy improves as more users contribute data.' },
  { q: 'Can I earn money through the rewards program?', a: 'You earn points by reporting queues, writing reviews, and uploading photos. Points can be redeemed for fuel vouchers and partner offers.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', reason: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="page">
      <section className="page-hero page-hero--compact">
        <div className="container">
          <div className="section__header" style={{ textAlign: 'center' }}>
            <span className="hero__badge">📬 Get In Touch</span>
            <h1 className="page-hero__title" style={{ maxWidth: 600, margin: '0 auto' }}>We'd Love to Hear From You</h1>
            <p className="page-hero__subtitle" style={{ maxWidth: 500, margin: '0.5rem auto 0' }}>
              Whether you want to partner, list your station, or just say hello — drop us a message.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Form */}
            <div className="contact-form-wrap">
              {submitted ? (
                <div className="contact-success">
                  <span className="contact-success__icon">✅</span>
                  <h3>Message Sent!</h3>
                  <p>We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="contact-form__field">
                    <label>Full Name</label>
                    <input type="text" placeholder="Your name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div className="contact-form__field">
                    <label>Email Address</label>
                    <input type="email" placeholder="you@company.com" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                  <div className="contact-form__field">
                    <label>Reason</label>
                    <select required value={form.reason} onChange={e => setForm({...form, reason: e.target.value})}>
                      <option value="">Select a reason</option>
                      {contactReasons.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="contact-form__field">
                    <label>Message</label>
                    <textarea rows="5" placeholder="Tell us more..." required value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                  </div>
                  <button type="submit" className="btn btn--primary btn--full">Send Message ↗</button>
                </form>
              )}
            </div>

            {/* Office Info */}
            <div className="contact-info">
              <h3 className="contact-info__title">Our Offices</h3>
              {offices.map((o) => (
                <div key={o.city} className="office-card">
                  <h4 className="office-card__city">{o.city}</h4>
                  <p className="office-card__address">{o.address}</p>
                  <p className="office-card__detail">📞 {o.phone}</p>
                  <p className="office-card__detail">✉️ {o.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section--gray">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">FAQ</span>
            <h2 className="section__title">Frequently Asked Questions</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'faq-item--open' : ''}`}>
                <button className="faq-item__question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span className="faq-item__toggle">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <div className="faq-item__answer"><p>{faq.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
