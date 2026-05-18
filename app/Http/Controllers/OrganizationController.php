<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\Subscription;
use Illuminate\Http\Request;

class OrganizationController extends Controller
{
    public function index()
    {
        $orgs = Organization::withCount('users')
            ->with('activeSubscription')
            ->orderBy('name')
            ->paginate(20);
        return view('organizations.index', compact('orgs'));
    }

    public function create()
    {
        $parents = Organization::orderBy('name')->get();
        return view('organizations.create', compact('parents'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'      => 'required|string|max:255',
            'parent_id' => 'nullable|exists:organizations,id',
        ]);
        $org = Organization::create($data);
        return redirect()->route('organizations.show', $org)->with('success', 'Organisation created.');
    }

    public function show(Organization $organization)
    {
        $organization->load(['users.roles', 'subscriptions', 'parent', 'children']);
        return view('organizations.show', compact('organization'));
    }

    public function edit(Organization $organization)
    {
        $parents = Organization::where('id', '!=', $organization->id)->orderBy('name')->get();
        return view('organizations.edit', compact('organization', 'parents'));
    }

    public function update(Request $request, Organization $organization)
    {
        $data = $request->validate([
            'name'      => 'required|string|max:255',
            'parent_id' => 'nullable|exists:organizations,id',
        ]);
        $organization->update($data);
        return redirect()->route('organizations.show', $organization)->with('success', 'Organisation updated.');
    }

    public function destroy(Organization $organization)
    {
        $organization->delete();
        return redirect()->route('organizations.index')->with('success', 'Organisation deleted.');
    }

    public function addSubscription(Request $request, Organization $organization)
    {
        $data = $request->validate([
            'plan_name'  => 'required|string|max:100',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after:start_date',
        ]);
        Subscription::create(array_merge($data, ['organization_id' => $organization->id, 'status' => 'active']));
        return back()->with('success', 'Subscription added.');
    }
}
