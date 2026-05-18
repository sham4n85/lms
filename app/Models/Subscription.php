<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    protected $fillable = ['organization_id', 'plan_name', 'start_date', 'end_date', 'status'];

    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function scopeExpiring(Builder $query, int $days = 30): Builder
    {
        return $query->where('status', 'active')
            ->whereBetween('end_date', [now(), now()->addDays($days)]);
    }

    public function markStatus(): void
    {
        if ($this->end_date->isPast()) {
            $this->update(['status' => 'expired']);
        }
    }

    public function getDaysRemainingAttribute(): int
    {
        return max(0, now()->diffInDays($this->end_date, false));
    }
}
