import { useEffect, useState } from 'react';
import { Send, CheckCircle, AlertCircle, Mail, MessageCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '../../lib/hooks/useAuth';

// Validation Schema
const contactSchema = z.object({
    email: z.email().min(1, "Email is required"),
    name: z.string().min(3, "Name is required is required"),
    category: z.string().min(1, 'Please select a category'),
    subject: z.string().min(5, 'Subject must be at least 5 characters').max(100, 'Subject is too long'),
    message: z.string().min(20, 'Please provide more detail (at least 20 characters)').max(2000, 'Message is too long'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
    const { user, isLoading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        setValues,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            category: 'general',
            subject: '',
            message: '',
            email: user?.email ?? "",
            name: user?.user_metadata?.full_name || user?.email?.split('@')[0]
        },
    });

    useEffect(() => {
        if (user) {
            setValues({
                email: user?.email ?? "",
                name: user?.user_metadata?.full_name || user?.email?.split('@')[0]
            })
        }
    }, [user])

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/support/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Message sent!', {
                    description: "We'll reply within 24 hours.",
                    icon: <CheckCircle className="w-5 h-5" />,
                });
                reset();
            } else {
                throw new Error(result.error || 'Failed to send');
            }
        } catch (error) {
            toast.error('Failed to send message', {
                description: 'Please email support@prepmirrors.com directly.',
                icon: <AlertCircle className="w-5 h-5" />,
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    if (isLoading) {
        return <div className='flex h-full items-center justify-center'>
            <Loader2 className="w-8 h-8  text-primary-500 animate-spin" />
        </div>
    }

    return (
        <div className="bg-white dark:bg-neutral-800/50 rounded-3xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
                {/* Left Side - Info */}
                <div className="bg-gradient-to-br from-primary-500  p-8 text-white">
                    <div className="flex flex-col h-full justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                                <Mail className="w-4 h-4" />
                                <span>Get in touch</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4">We're here to help</h3>
                            <p className="text-white/80 mb-6 leading-relaxed">
                                Our support team typically responds within 24 hours. For urgent issues,
                                you can also reach us directly via email.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="w-4 h-4 text-white/70" />
                                    <span>support@prepmirrors.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <MessageCircle className="w-4 h-4 text-white/70" />
                                    <span>Average response: &lt; 24 hours</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/20">
                            <p className="text-sm text-white/60">
                                Available Monday - Friday, 9am - 5pm EST
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="p-8">
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                        Send us a message
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">
                        Fill out the form below and we'll get back to you as soon as possible.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Category *
                            </label>
                            <select
                                {...register('category')}
                                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                            >
                                <option value="general">💬 General Question</option>
                                <option value="technical">⚙️ Technical Issue</option>
                                <option value="billing">💰 Billing Question</option>
                                <option value="feature">✨ Feature Request</option>
                                <option value="bug">🐛 Bug Report</option>
                            </select>
                            {errors.category && (
                                <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
                            )}
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Subject *
                            </label>
                            <input
                                {...register('subject')}
                                type="text"
                                placeholder="Brief summary of your issue"
                                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                            />
                            {errors.subject && (
                                <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Email *
                            </label>
                            <input
                                {...register('email')}
                                type="email"
                                placeholder="steve@gmail.com"
                                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Name
                            </label>
                            <input
                                {...register('name')}
                                type="text"
                                placeholder="Steve Jobs"
                                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Message
                            </label>
                            <textarea
                                {...register('message')}
                                rows={5}
                                placeholder="Please provide as much detail as possible..."
                                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                            />
                            {errors.message && (
                                <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 hover:shadow-xl"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Send Message
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}